const VMMFactory = artifacts.require('VMMFactory');

contract('VMMFactory', (accounts) => {
  it('Verify a Human Standard Token once deployed using both verification functions.', async () => {
    const factory = await VMMFactory.new();
    const newTokenAddr = await factory.createVMM.call(100000, 'Simon Bucks', 2, 'SBX', { from: accounts[0] });
    await factory.createVMM(100000, 'Simon Bucks', 2, 'SBX', { from: accounts[0] });
    const res = await factory.verifyVMM.call(newTokenAddr, { from: accounts[0] });
    assert(res, 'Could not verify the token.');
  });
});
