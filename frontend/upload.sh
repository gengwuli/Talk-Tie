  heroku apps:destroy --app gengwufront --confirm gengwufront
  rm -rf .git
  rm -rf Procfile 
  git init
  heroku create gengwufront
  echo web: bin/start-nginx -f > Procfile
     echo npm-debug.log >> .gitignore
    echo upload.sh >> .gitignore  
  git add *
  git commit -m 'initial commit'
  heroku buildpacks:set https://github.com/skotep/nginx-buildpack.git
  git push heroku master
  heroku ps:scale web=1
