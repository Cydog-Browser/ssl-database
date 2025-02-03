commit=false
origin=$(git remote get-url origin)
if [[ $origin == *Cydog-Browser/ssl-database* ]]
then
  commit=true
fi

KEYSARRAY=()
URLSARRAY=()

serversConfig="./servers.cfg"
echo "Reading $serversConfig"
while read -r line
do
  echo "  $line"
  IFS='=' read -ra TOKENS <<< "$line"
  KEYSARRAY+=(${TOKENS[0]})
  URLSARRAY+=(${TOKENS[1]})
done < "$serversConfig"

echo "***********************"
echo "Updating SSL database with ${#KEYSARRAY[@]} configs:"

mkdir -p certs
mkdir -p publickeys

for (( index=0; index < ${#KEYSARRAY[@]}; index++))
do
  key="${KEYSARRAY[index]}"
  url="${URLSARRAY[index]}"
  echo "  $key=$url"

  for i in 1 2 3 4; 
  do
    responsePem=$(echo | openssl s_client -showcerts -servername $url -connect $url:443 2>/dev/null | openssl x509 -inform pem)
  done
  if [[ $commit == true ]]
  then
    #save pem
    echo "saving ssl from $url"
    echo $responsePem | tr ' ' '\n' > ./certs/pem/$key.pem
    echo "${responsePem#-----BEGIN\nCERTIFICATE-----}" > ./certs/pem/$key.pem
    makeReadable=$(openssl x509 -in ./certs/pem/$key.pem -text -noout)
    echo $makeReadable > ./certs/readable/$key.txt
    #convert to other usable standards
    convertDer=$(openssl x509 -outform der -in ./certs/pem/$key.pem -out ./certs/der/$key.der)
    convertCrt=$(openssl x509 -in ./certs/pem/$key.pem -out ./certs/crt/$key.crt)
    makePublicKey=$(cat ./certs/pem/$key.pem | sed '1d;$d' | base64 -d | shasum -a256)
    echo $makePublicKey | tr -d ' -' > ./publickeys/$key.txt
  else
    echo "incorrect repository"
  fi
done

if [[ $commit == true ]]
then
  git config --global user.name 'Cydog'
  git config --global user.email 'cydog@cydogbrowser.com'
  git add -A --force logs/
  git commit -am '[Automated] Updated Database'
  git push
fi
