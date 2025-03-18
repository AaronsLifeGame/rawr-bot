# RAWR Bot

Ron and Wraith's Racing Bot

# Changelog

**Initial commit: v0.0.0** - 2025-03-12

- Repository created with 'README.md'.

**Initial release: v0.1.0** - 2025-03-16

- Basic bot setup with connections to:

  - Discord application and API.
  - Google API.

- Core commands implemented:

  - `*points` `[gamertag/username/team]` - Displays your current points, or the selected driver/team.
  - `*standings` `[gamertag/username]` - Displays overall driver standings, or the selected driver.
  - `*constructors` `[gamertag/username/team]` - Displays overall team standings, or the selected team.

- Event handling:

  - Responds to messages with a prefix.
  - Logs errors to `/logs`.
  - Executes when bot is connected and ready.

# RAWR Bot

Ron and Wraith's Racing Bot

# Changelog

**Initial commit: v0.0.0** - 2025-03-12

- Repository created with 'README.md'.

**Initial release: v0.1.0** - 2025-03-15

- Basic bot setup with connections to:

  - Discord application and API.
  - Google API.

- Core commands implemented:

  - `*points` `[gamertag/username/team]` - Displays your current points, or the selected driver/team.
  - `*standings` `[gamertag/username]` - Displays overall driver standings, or the selected driver.
  - `*constructors` `[gamertag/username/team]` - Displays overall team standings, or the selected team.

- Event handling:

  - Responds to messages with a prefix.
  - Logs errors to `/logs`.
  - Executes when bot is connected and ready.

**Fixed bugs: v0.1.1** - 2025-03-18

- New commands:

  - `*help` - Shows all available commands.
  - `*github` - Link to the GitHub.

- Fixes and Improvements:

  - Standings and constructors table, fixed unaligned title indentation.
  - Current Position included to each place, under points/standings/and constructors.
  - Fixed command logging to include input.
