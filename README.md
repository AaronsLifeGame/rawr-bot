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

**Fixed bugs: v0.1.1** - 2025-03-18

- New commands:

  - `*help` - Shows all available commands.
  - `*github` - Link to the GitHub.

- Fixes and Improvements:

  - Standings and constructors table, fixed unaligned title indentation.
  - Current Position included to each place, under points/standings/and constructors.
  - Fixed command logging to include input.

**Points update + fixes: v0.1.3** - 2025-03-19

(Note: v0.1.2 skipped due to internal changes and fixes.)

- Enhanced points/standings commands:

  - Combined standings and constructors lists.
  - Constructors command removed.
  - Cleaned up logic in points and standings.
  - Added standings 'cards' for driver's and team's position and points.

- Changes and fixes:

  - Updated `*help`.
  - Made wording clearer.
