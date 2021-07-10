const client = require("../index");

client.on("interaction", async (interaction) => {
  if (interaction.isCommand()) {
    await interaction.defer().catch(() => {});

    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd)
      return interaction.followUp({
        content: "Feels sad man, that command doesn't exist",
      });

    const args = [];

    interaction.options.array().map((x) => {
      args.push(x.value);
    });

    cmd.run(client, interaction, args);
  }
});
