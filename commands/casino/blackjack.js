const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const data = require('../../data_management')
const casinoUtils = require('../../utils/casino')

function shuffleDeck() {
  const suits = [':hearts:', ':diamonds:', ':clubs:', ':spades:'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(`${rank} ${suit}`);
    }
  }

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function calculateHandValue(hand) {
  let value = 0;
  let hasAce = false;

  for (const card of hand) {
    const rank = card.split(' ')[0];
    if (rank === 'A') {
      hasAce = true;
      value += 11;
    } else if (['K', 'Q', 'J'].includes(rank)) {
      value += 10;
    } else {
      value += parseInt(rank, 10);
    }
  }

  while (hasAce && value > 21) {
    value -= 10;
    hasAce = false;
  }

  return value;
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('Play a game of Blackjack')
    .addNumberOption(option =>
        option
            .setName('bet')
            .setDescription('The amount of money to bet')
            .setRequired(true)),

  async execute(interaction) {
    let newData = await data.getData()
    const amount = await interaction.options.getNumber('bet')

    if (!newData[interaction.user.id]) {
      newData[interaction.user.id] = data.defaultData
      data.setData(newData)
    }

    let result = undefined

    if (!casinoUtils.isCasinoOpen()) {
        result = '**The casino is currently closed! Try again between 6 AM to 10 AM or 9 PM to 2 AM (UTC timezone).**'
    } else if (amount < 5000) {
        result = '**The minimum bet allowed is 5K <:NebulaBuck:1178388626132971590>! Please try betting more.**'
    } else if (amount > 500_000) {
        result = '**The maximum bet allowed is 500K <:NebulaBuck:1178388626132971590>! Please try betting less.**'
    } else if (newData[interaction.user.id].Money < amount) {
        result = '**You don\'t have enough money to bet! Please try a lower amount (Minimum of 5K <:NebulaBuck:1178388626132971590>)**'
    }  

    if (result !== undefined) {
        newData.Money -= amount
        data.setData(newData)
        await interaction.reply(result)
        return
    }

    const deck = shuffleDeck();
    const playerHand = [deck.pop(), deck.pop()];
    const dealerHand = [deck.pop(), deck.pop()];

    let playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand);

    const initialEmbed = {
      color: 0x3498db,
      title: '**Blackjack**',
      description: `**Your hand: ${playerHand.join(', ')} (Value: ${playerValue})**\n\n**Dealer's hand: ${dealerHand[0]} and ? (Value: ??)**`,
    };

    const hitButton = new ButtonBuilder()
      .setCustomId('hit')
      .setLabel('Hit')
      .setStyle(ButtonStyle.Primary);

    const standButton = new ButtonBuilder()
      .setCustomId('stand')
      .setLabel('Stand')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(hitButton, standButton);

    await interaction.reply({ embeds: [initialEmbed], components: [row] });

    // Game logic
    const filter = i => {
      i.deferUpdate();
      return i.customId === 'hit' || i.customId === 'stand';
    };

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      if (i.member.id !== interaction.user.id) return

      if (i.customId === 'hit') {
        const newCard = deck.pop();
        playerHand.push(newCard);
        playerValue = calculateHandValue(playerHand);

        if (playerValue > 21) {
          collector.stop();

          const bustEmbed = {
            color: 0xe74c3c,
            title: '**Blackjack - Bust!**',
            description: `**Your hand: ${playerHand.join(', ')} (Value: ${playerValue})**\n\n**Dealer's hand: ${dealerHand.join(', ')} (Value: ${dealerValue})\n\nYou busted!**`,
          };

          await interaction.editReply({ embeds: [bustEmbed], components: [] });
        } else {
            playerValue = calculateHandValue(playerHand);

            const updatedEmbed = {
                color: 0x3498db,
                title: '**Blackjack**',
                description: `**Your hand: ${playerHand.join(', ')} (Value: ${playerValue})**\n\n**Dealer's hand: ${dealerHand[0]} and ? (Value: ??)**`,
          };

          await interaction.editReply({ embeds: [updatedEmbed], components: [row] });
        }
      } else if (i.customId === 'stand') {
        collector.stop();

        while (dealerValue < 17) {
          const newCard = deck.pop();
          dealerHand.push(newCard);
          dealerValue = calculateHandValue(dealerHand);
        }

        newData = await data.getData()

        let result;
        if (dealerValue > 21 || playerValue > dealerValue) {
          result = `**You win! (+${amount} <:NebulaBuck:1178388626132971590>)**`;
          newData.Money += amount * 2
        } else if (dealerValue > playerValue) {
          result = `**Dealer wins! (-${amount} <:NebulaBuck:1178388626132971590>)**`;
        } else {
          result = '**It\'s a tie! (+0 <:NebulaBuck:1178388626132971590>)**';
          newData.Money += amount
        }

        data.setData(newData)

        const finalEmbed = {
          color: 0x3498db,
          title: '**Blackjack - Final Results**',
          description: `**Your hand: ${playerHand.join(', ')} (Value: ${playerValue})**\n\n**Dealer's hand: ${dealerHand.join(', ')} (Value: ${dealerValue})**\n\n${result}`,
        };

        await interaction.editReply({ embeds: [finalEmbed], components: [] });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        const timeoutEmbed = {
          color: 0xe74c3c,
          title: '**Blackjack - Timeout**',
          description: '**The game has ended due to inactivity.**',
        };

        interaction.editReply({ embeds: [timeoutEmbed], components: [] });
      }
    });
  },
};