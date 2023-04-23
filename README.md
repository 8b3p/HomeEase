in package.json, in script "gen", change it to  
"gen": "npm remove @prisma-client && sudo prisma generate",
and
"push-db": "sudo dotenv -e ./env/development.env -- prisma db push"
if on linux, differnece is the "sudo" in both scripts, alternatively remove the
sudo if on windows.
