# Cydog Browser's SSL Database
This database is meant to help me use certificate pinning in Cydog Browser (and other) apps. Usually, certificate pinning is done by apps for their internal websites and services so users get the most trusted connection possible. I wanted to create a database for external websites and services so I could pin these certificates for any and every connection possible. I didn't just want to increase trust. I wanted to ensure it. Downloading the certificate for the server I am about to connect to seemed insecure. With this database, there is a log of all downloaded certificates that can be vetted in case of compromise with a date-time-group that helps narrow down the paramters to determine when the compromise occurred. This is extremely important in web forensics. Furthermore, publishing it on a public GitHub repo allows this database to be transparent. 

## Due outs 

+ Increase domains listed in servers.cfg
+ Create method to track cert changes without going through commits
+ Parse readable certificate data into a more web readable format
+ Implement basic verification framework for HKPK

## Usage

Our SSL Database is essentially a static API for [leaf certificate](https://blog.vpntracker.com/what-types-of-certificates-are-there/#:~:text=Leaf%20certificates%20are%20at%20the,or%20decrypt%20and%20verify%20data.) and/or [HKPK](https://datatracker.ietf.org/doc/html/rfc7469) pinning. 

To use it for leaf certificate pinning:
```
https://raw.githubusercontent.com/Cydog-Browser/ssl-database/refs/heads/main/certs/crt/[INSERT DOMAIN HERE].crt
```

To use it for HKPK pinning:
```
https://raw.githubusercontent.com/Cydog-Browser/ssl-database/refs/heads/main/publickeys/[INSERT DOMAIN HERE].txt
```

## Contribute
Send me a pull request!

## See our terms & conditions
[Our terms & conditions](https://cydogbrowser.com/cydogconditions)

## Want to know more?
Visit [https://cydogbrowser.com](https://cydogbrowser.com/)