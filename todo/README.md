# Require packages
<pre>
npm install -g yarn
npm install -g truffle
npm install -g testrpc
</pre>

##1. Install dependencies
<pre>
yarn
</pre>

##2. Start TestRPC (optional, for local test only)
<pre>
testrpc -s
</pre>

##3. Compile contract's source
<pre>
truffle compile
</pre>

##4. Deploy contract
<pre>
truffle migrate
</pre>

##5. Start Block parser
<pre>
yarn parser
</pre>

##6. Test creating a task and push to blockchain
<pre>
yarn addTask
</pre>