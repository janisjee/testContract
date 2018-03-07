# Require packages
<pre>
npm install -g truffle
npm install -g testrpc
</pre>

##1. Install dependencies
<pre>
npm install
</pre>

##2. Compile contract's source
<pre>
truffle compile
</pre>

##3. Deploy contract
<pre>
truffle migrate
</pre>

##Note:

Before compile and deploy contract, we need to start TestRPC. Using command below:

<pre>
testrpc -s
</pre>