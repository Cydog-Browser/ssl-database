# Cydog Browser's SSL Database
This database is meant to help me use certificate pinning in Cydog Browser (and other) apps. Usually, certificate pinning is done by apps for their internal websites and services so users get the most trusted connection possible. I wanted to create a database for external websites and services so I could pin these certificates for any and every connection possible. I didn't just want to increase trust. I wanted to ensure it. Downloading the certificate for the server I am about to connect to seemed insecure. With this database, there is a log of all downloaded certificates that can be vetted in case of compromise with a date-time-group that helps narrow down the paramters to determine when the compromise occurred. This is extremely important in web forensics. Furthermore, publishing it on a public GitHub repo allows this database to be transparent.

## How does it work?
This SSL Database is essentially a static API for [leaf certificate](https://blog.vpntracker.com/what-types-of-certificates-are-there/#:~:text=Leaf%20certificates%20are%20at%20the,or%20decrypt%20and%20verify%20data.) and/or [HKPK](https://datatracker.ietf.org/doc/html/rfc7469) pinning.

## Cydog Blockchain
The [Cydog Blockchain](https://cydogbrowser.com/cychain.php) was made to support this project. While our SSL Database auto-generates leaf certificates, our Cydog Blockchain provides a method to duplicate verification for methods beyond certificate pinning. For instance, leaf certificates can be intercepted by hackers who Man in the Middle (MitM) your connections. This means downloaded leaf certificates could be fraudulent without you being aware. But, similarly, our SSL Database project relies on daily pulls from a single point of failure, even if the runners rotate pseudo randomly. As a result, the leaf blockchain was formed. Users from around the world can now upload leaf certificates to our blockchain where their contributions will be memorialized in a public blockchain via a SHA3 hash of their IP Address. This makes it impossible to de-anonymization leaf certificate contributions from contributors but allows IP Addresses to gain validator strength for later contributions with our future ranking system. 

### Here's how the Cydog Blockchain will work with the SSL Database...
+ Users looking to secure their JavaScript fetches and XMLHttpRequest (XHR) will add a header labeled 'ssl-cert'
+ For example, for Apache, you would add this to your HTACCESS:
```
<IfModule mod_headers.c>
    Header set ssl-cert "https://cydogbrowser.com/static/chain/certificates/[INSERT DOMAIN HERE].json"
</IfModule>
```
+ You can use our new custom built [cysecurity.js](https://github.com/Cydog-Browser/cy-security-js) solution to fully integrate with our blockchain with a simple JavaScript drop-in
+ What will this do exactly?
    - For now, you will be able to check pre-processed leaf certificate data in json format to:
        + Check number of leaf validations or the number of leaf submissions by domain
        + Compare pinned certificates in our SSL Database to leaf certificates on our Blockchain
        + Check creation and expiration dates for leaf certificates, which can't be forged, unlike certificate domains
        + See if the current leaf certificate is under threat by viewing failed leaf submission validations
+ The blockchain is still under development so submission will not be processed at this time.

## SSL Database Due outs 
+ Increase domains listed in servers.cfg
+ Create method to track cert changes without going through commits
+ Parse readable certificate data into a more web readable format (Started)
+ Implement basic verification framework for Leaf/HKPK (Started)

## Usage
Eventually, this project will create a multitude of nodes to host backup copies of this public git. For now, it relies on GitHub's raw.githubusercontent.com static hosting.

To use it for leaf certificate pinning:
```
https://raw.githubusercontent.com/Cydog-Browser/ssl-database/refs/heads/main/certs/crt/[INSERT DOMAIN HERE].crt
```

To use it for HKPK (computed hashes are SHA-256) pinning:
```
https://raw.githubusercontent.com/Cydog-Browser/ssl-database/refs/heads/main/publickeys/[INSERT DOMAIN HERE].txt
```

## Contribute
Send me a pull request!

## See our terms & conditions
[Our terms & conditions](https://cydogbrowser.com/cyterms.html)

## Want to know more?
Visit [https://cydogbrowser.com](https://cydogbrowser.com/)