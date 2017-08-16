    #heroku apps:destroy --app gengwuback --confirm gengwuback
#	rm -rf .git
 #   rm -rf .gitignore 
  #  rm -rf Procfile 
   # git init
    #ls -al
   # heroku create gengwuback
   # echo web: node index.js
   # echo web: node index.js > Procfile
   # echo node_modules >> .gitignore
   # echo cred.json >> .gitignore 
   # echo initDatabase.js >> .gitignore 
   # echo npm-debug.log >> .gitignore 
   # echo upload.sh >> .gitignore
    git add .
    git commit -m 'init'
    git push heroku master
    heroku ps:scale web
