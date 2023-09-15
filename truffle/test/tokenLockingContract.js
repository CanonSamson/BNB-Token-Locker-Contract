const TokenLockingContract = artifacts.require("TokenLockingContract");

contract("TokenLockingContract", accounts => {
  let tokenLockingContract;
  const owner = accounts[0];
  const userAddress = accounts[1];
  const userAddress2 = accounts[2];
  const userAddress3 = accounts[3];
  const userName = "Canon";
  const userLastName = "Samson";
  const userName2 = "Jane";
  const userLastName2 = "Smith";

  beforeEach(async () => {
    tokenLockingContract = await TokenLockingContract.new({ from: owner });
  });

  describe("add user", () => {
    it("should allow adding a new user", async () => {
      // Add the user
      await tokenLockingContract.addUser(userName, userLastName, { from: userAddress });

      // Call the getUser function to retrieve user data
      const userData = await tokenLockingContract.getUser(userAddress);

      assert.equal(userData.name, "Canon", "User's first name should match");
      assert.equal(userData.lastname, "Samson", "User's last name should match");
      assert.equal(userData.walletAddress, userAddress, "User's wallet address should match");

    });

    it("should not allow adding an existing user", async () => {

      // Add the user once
      await tokenLockingContract.addUser(userName2, userLastName2, { from: userAddress2 });

      // Try to add the same user again and expect an error
      try {
        await tokenLockingContract.addUser(userName2, userLastName2, { from: userAddress2 });
        assert.fail("Adding an existing user should throw an error");
      } catch (error) {
        assert.include(error.message, "User already exists", "Error message should indicate user exists");
      }
    });
  });



  describe(" locking tokens for a user", () => {
    it("should allow a user to lock tokens", async () => {
      const duration = 7 * 24 * 3600; // 7 days in seconds
      const lockAmount = 1

      await tokenLockingContract.addUser(userName, userLastName, { from: userAddress });

      // Check that the user's tokens are initially unlocked
      const initialLockedAmount = await tokenLockingContract.userLocks(userAddress);
      assert.equal(initialLockedAmount.amount, 0, "Initial locked amount should be 0");

      // Lock tokens for the user
      await tokenLockingContract.lockTokens(duration, {
        from: userAddress,
        value: lockAmount,
      });

      // Check that the user's tokens are now locked
      const lockedAmount = await tokenLockingContract.userLocks(userAddress);
      assert.equal(lockedAmount.amount.toString(), lockAmount, "Locked amount should match");
    });


    it("should not allow locking tokens for a non-existent user", async () => {
      const lockDuration = 86400; // 1 day in seconds

      // Attempt to lock tokens for a non-existent user and expect an error
      try {
        await tokenLockingContract.lockTokens(lockDuration, { from: userAddress2, value: 1 });
        assert.fail("Locking tokens for a non-existent user should throw an error");
      } catch (error) {
        assert.include(error.message, "User does not exist!", "Error message should indicate user doesn't exist");
      }
    });

  });




  describe("unlock tokens ", () => {
    it("should unlock tokens for a user with valid conditions", async () => {

      // Ensure the user exists by adding them and locking tokens (assuming addUser and lockTokens functions exist)
      await tokenLockingContract.addUser("Canon", "Samson", { from: userAddress });
      await tokenLockingContract.lockTokens(3, { from: userAddress, value: 1 });

      try {

        await new Promise(resolve => setTimeout(resolve, 36));

        await tokenLockingContract.unlockTokens({ from: userAddress });
        assert.fail("Unlocking should fail because tokens are still locked");

        const user = await tokenLockingContract.getUser(userAddress);

        const userBalanceAfter = await tokenLockingContract.userLocks(user.walletAddress);

        assert.equal(userBalanceAfter.amount, 0, "Tokens were not unlocked");
      } catch (error) {
        // Check if the error message contains the expected error message
        assert.include(error.message, "Tokens are still locked", "Expected 'Tokens are still locked' error");
      }

    });

    it("should not unlock tokens for a non-existent user", async () => {

      // Attempt to unlock tokens for a non-existent user and expect an error
      try {
        await tokenLockingContract.unlockTokens({ from: userAddress2 });
        assert.fail("Unlocking tokens for a non-existent user should throw an error");
      } catch (error) {
        assert.include(error.message, "User does not exist!", "Error message should indicate user doesn't exist");
      }
    });


    it("should not unlock tokens if no tokens are locked", async () => {

      // Ensure the user exists by adding them (assuming addUser function exists)
      await tokenLockingContract.addUser("Alice", "Smith", { from: userAddress3 });

      // Attempt to unlock tokens when no tokens are locked and expect an error
      try {
        await tokenLockingContract.unlockTokens({ from: userAddress3 });
        assert.fail("Unlocking tokens with no locked tokens should throw an error");
      } catch (error) {
        assert.include(error.message, "No tokens locked", "Error message should indicate no tokens locked");
      }
    });

    it("should not unlock tokens if tokens are still locked", async () => {
      const tokenLockingContract = await TokenLockingContract.deployed();
      const lockDuration = 86400; // 1 day in seconds
      const lockAmount = 1;

      // Ensure the user exists by adding them and locking tokens (assuming addUser and lockTokens functions exist)
      await tokenLockingContract.addUser("Bob", "Johnson", { from: userAddress });
      await tokenLockingContract.lockTokens(lockDuration, { from: userAddress, value: lockAmount });

      // Attempt to unlock tokens while they are still locked and expect an error
      try {
        await tokenLockingContract.unlockTokens({ from: userAddress });
        assert.fail("Unlocking tokens while tokens are still locked should throw an error");
      } catch (error) {
        assert.include(error.message, "Tokens are still locked", "Error message should indicate tokens are still locked");
      }
    });

  });



  describe("get user ", () => {
    it("should return user data for an existing user", async () => {
      const userAddress = accounts[1];

      // Ensure the user exists by adding them (assuming addUser function exists)
      await tokenLockingContract.addUser("Canon", "Samson", { from: userAddress });

      // Call the getUser function to retrieve user data
      const userData = await tokenLockingContract.getUser(userAddress);

      assert.equal(userData.name, "Canon", "User's first name should match");
      assert.equal(userData.lastname, "Samson", "User's last name should match");
      assert.equal(userData.walletAddress, userAddress, "User's wallet address should match");
    });


    it("should throw an error for a non-existent user", async () => {
      const nonExistentAddress = accounts[4];

      // Attempt to get user data for a non-existent user and expect an error
      try {
        await tokenLockingContract.getUser(nonExistentAddress);
        assert.fail("Getting user data for a non-existent user should throw an error");
      } catch (error) {
        assert.include(error.message, "User does not exist", "Error message should indicate user doesn't exist");
      }
    });
  });



  describe("calculate rewards", () => {
    it("should calculate rewards for an existing user", async () => {
      const lockDuration = 86400; // 1 day in seconds
      const lockAmount = web3.utils.toWei("1", "ether"); // Lock 1 ETH
      const interestRate = 1000; // Assuming interest rate is 10% (1000/10000)

      // Ensure the user exists by adding them and locking tokens (assuming addUser and lockTokens functions exist)
      await tokenLockingContract.addUser("Canon", "Samson", { from: userAddress });
      await tokenLockingContract.lockTokens(lockDuration, { from: userAddress, value: lockAmount });

      // Calculate expected rewards based on the provided formula
      const userLock = await tokenLockingContract.userLocks(userAddress);
      const expectedRewards = (userLock.amount * interestRate * lockDuration) / 1e18;

      // Call the CalculateUserTokensRewards function to calculate rewards
      const calculatedRewards = await tokenLockingContract.CalculateUserTokensRewards({ from: userAddress });


    });

    it("should throw an error for a non-existent user", async () => {
      const nonExistentAddress = accounts[2];

      // Attempt to calculate rewards for a non-existent user and expect an error
      try {
        await tokenLockingContract.CalculateUserTokensRewards({ from: nonExistentAddress });
        assert.fail("Calculating rewards for a non-existent user should throw an error");
      } catch (error) {
        assert.include(error.message, "User does not exist", "Error message should indicate user doesn't exist");
      }
    });
  });


  describe("return the lock timestamp", () => {
    it("should return the lock timestamp for an existing user", async () => {

      // Ensure the user exists by adding them and locking tokens (assuming addUser and lockTokens functions exist)
      await tokenLockingContract.addUser("Canon", "Samson", { from: userAddress });
      await tokenLockingContract.lockTokens(86400, { from: userAddress, value: web3.utils.toWei("1", "ether") });

      // Call the getUserLockTimestamp function to retrieve the lock timestamp
      const lockTimestamp = await tokenLockingContract.getUserLockTimestamp({ from: userAddress });

      // Calculate the expected lock timestamp based on the current block timestamp and lock duration
      const currentBlockTimestamp = (await web3.eth.getBlock("latest")).timestamp;
      const expectedLockTimestamp = currentBlockTimestamp + 86400;

      // Check that the returned lock timestamp matches the expected lock timestamp
      assert.equal(lockTimestamp.toNumber(), expectedLockTimestamp, "Lock timestamp should match expected lock timestamp");
    });

    it("should throw an error for a non-existent user", async () => {
      const nonExistentAddress = accounts[4];

      // Attempt to get the lock timestamp for a non-existent user and expect an error
      try {
        await tokenLockingContract.getUserLockTimestamp({ from: nonExistentAddress });
        assert.fail("Getting the lock timestamp for a non-existent user should throw an error");
      } catch (error) {
        assert.include(error.message, "User does not exist", "Error message should indicate user doesn't exist");
      }
    });
  });



  describe("contract balance", () => {
    it("should return the contract balance when called by the owner", async () => {
      const initialBalance = await web3.eth.getBalance(tokenLockingContract.address);

      // Call the getContractBalance function as the owner
      const contractBalance = await tokenLockingContract.getContractBalance({ from: owner });


      assert.equal(
        contractBalance.toString(),
        initialBalance.toString(),
        "Contract balance should match initial balance"
      );
    });


  });

});
