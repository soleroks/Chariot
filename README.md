# CHARIOT

## Purpose:

*This bot was designed for my fantasy-fiction MMORPG concept text-based Discord roleplay server.*


## Contents:
- Maintanence Mod (Bot stays online, users cant interact with it, except members assigned as a developer.)
- Internal DB selector function for production and testing database connections. (client.dbConnect('dbname', 'InventoryDbName'))
- Functions for fetching members, channels and random SOL Codes (digits and numbers on SOL_LLLL_NNNN format)
- Advanced Mongoose scheming for efficient member profiles. (inventory.findOne, staffmember.findOne, member.findOne etc.)
- Roleplay point system, based on users message lengths on particular text channels. (Formula: Message content/2)
- All new Discord application commands for particular purposes. Showing roleplay point leaderboard, sending currency to other players etc.
- Very bare metal support for right-click commands
- Optimized for low resource consumption (Tested, bot only consumes around 100MB of system memory on full load.)


## Libraries
 - Discord.JS v14
 - Mongoose
 - Moment

## Can I use this?
*Well, since I stopped my project about server and publishing this, it's free for use. But you may want to edit some of parts for your own.*

## A Favor.
*I was very eager to see this bot finished. Since I am publishing this as a FOSS project. Please create your own branch based on this with your version of Chariot!* (Don't forget to exclude your tokens!)
