import {
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployTaskManagementFixture, taskDetails1, TaskManagementFixture } from "./fixtures";

//function to get the unixtimestamp 
function getUnixTimeStamp() {
    return Math.floor(new Date().getTime() / 1000);
}

describe('------ Task Management Tests ------', function () {

    describe("Deployment", function () {
        let tmf: TaskManagementFixture;
        // let provider: EthereumProvider;
        before(async function () {
            tmf = await loadFixture(deployTaskManagementFixture);
        });
        it("should deploy contracts with expected initial values", async function () {
            expect(await tmf.rewardToken.name()).to.equal('Rahat');
            expect(await tmf.rewardToken.symbol()).to.equal('RTH');
            expect(await tmf.rewardToken.decimals()).to.equal(0n);
            expect(await tmf.rewardToken.totalSupply()).to.equal(0n);
        });

        it('should deploy entities with expected initial values', async function () {
            expect(await tmf.redEntity.appId()).to.equal(ethers.id('RedCafe'));
            expect(await tmf.blueEntity.appId()).to.equal(ethers.id('BlueCafe'));
            expect(await tmf.redEntity.acl()).to.equal(tmf.accessManagerV2.target);
            expect(await tmf.blueEntity.acl()).to.equal(tmf.accessManagerV2.target);
        });

        it("should deploy factory and entities correctly", async function () {
            const deployedContracts = await tmf.entityFactory.getDeployedContracts();
            expect(deployedContracts.length).to.equal(2);
            expect(deployedContracts[0]).to.equal(tmf.redEntity.target);
            expect(deployedContracts[1]).to.equal(tmf.blueEntity.target);
        });

        it("should deploy entities with correct names", async function () {
            expect(await tmf.redEntity.name()).to.equal("Red Entity");
            expect(await tmf.blueEntity.name()).to.equal("Blue Entity");
        });
    });

    describe("Happy Path: Red Task Management", function () {
        let tmf: TaskManagementFixture;
        before(async function () {
            tmf = await loadFixture(deployTaskManagementFixture);
        });

        it("should create a task", async function () {
            const task = {
                detailsUrl: taskDetails1,
                rewardToken: tmf.rewardToken.target,
                rewardAmount: 100,
                allowedWallets: [tmf.participant1.address, tmf.participant2.address],
                maxParticipants: 2,
                expiryDate: getUnixTimeStamp() + 86400,
                owner: tmf.redCakeTaskOwner.address,
                isActive: true
            };
            await tmf.redEntity.connect(tmf.redCakeTaskOwner).createTask(task);
            
            const taskId = await tmf.redEntity.findHash(taskDetails1);
            const savedTask = await tmf.redEntity.tasks(taskId);
            expect(savedTask.detailsUrl).to.equal(taskDetails1);
            expect(savedTask.rewardToken).to.equal(tmf.rewardToken.target);
            expect(savedTask.rewardAmount).to.equal(100);
            expect(savedTask.isActive).to.equal(true);
            expect(savedTask.owner).to.equal(tmf.redCakeTaskOwner.address);
            expect(savedTask.maxParticipants).to.equal(2);
        });
         it("should return correct participants from getAllowedWallets", async function () {
            // First get the task ID
            // const taskId = await tmf.redEntity.findHash(taskDetails1);
            
            // // Get allowed wallets for the task
            //  const allowedWallets = await tmf.redEntity.getAllowedWallets(taskId)
          
            
            // // Verify the participants
            // expect(allowedWallets).to.have.lengthOf(2);
            // expect(allowedWallets).to.include(tmf.participant1.address);
            // expect(allowedWallets).to.include(tmf.participant2.address);
            
            // // Verify these are the same participants we set during task creation
            // const task = await tmf.redEntity.tasks(taskId);
            // expect(allowedWallets).to.deep.equal([
            //     tmf.participant1.address,
            //     tmf.participant2.address
             // ]);
             
              const task = {
            detailsUrl: "test-task-1",
            rewardToken: tmf.rewardToken.target,
            rewardAmount: 100,
            allowedWallets: [tmf.participant1.address, tmf.participant2.address],
            maxParticipants: 2,
            expiryDate: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
            owner: tmf.redCakeTaskOwner.address,
            isActive: true
        };

        // Log task creation
        console.log("Creating task...");
        await tmf.redEntity.connect(tmf.redCakeTaskOwner).createTask(task);

        // Get and verify taskId
        const taskId = await tmf.redEntity.findHash(task.detailsUrl);
        console.log("TaskId:", taskId);

        // Verify task exists
        const savedTask = await tmf.redEntity.tasks(taskId);
        console.log("Task owner:", savedTask.owner);
        expect(savedTask.owner).to.not.equal(ethers.ZeroAddress, "Task should exist");

             const allowedWallets = await tmf.redEntity.getAllowedWallets(taskId);
            console.log("Allowed wallets:", allowedWallets);
        
        // Verify results
        expect(allowedWallets).to.have.lengthOf(2);
        expect(allowedWallets).to.include(tmf.participant1.address);
        expect(allowedWallets).to.include(tmf.participant2.address);
        });

        it('should participate in a task', async function () {
            const taskId = await tmf.redEntity.findHash(taskDetails1);
            await tmf.redEntity.connect(tmf.participant1).participate(taskId);
            const status = await tmf.redEntity.taskAssignments(taskId, tmf.participant1.address);
            expect(status).to.equal(0);//UNACCEPTED
        });

        it('should accept participation in a task', async function () {
            const taskId = await tmf.redEntity.findHash(taskDetails1);
            await tmf.redEntity.connect(tmf.redCakeTaskOwner).acceptParticipant(taskId, tmf.participant1.address);
            const status = await tmf.redEntity.taskAssignments(taskId, tmf.participant1.address);
            expect(status).to.equal(1);//ACCEPTED
        });

        it('should complete a task', async function () {
            const taskId = await tmf.redEntity.findHash(taskDetails1);
            await tmf.redEntity.connect(tmf.participant1).completeTask(taskId);
            const status = await tmf.redEntity.taskAssignments(taskId, tmf.participant1.address);
            expect(status).to.equal(2);//COMPLETED
        });

        it('should verify task completion and distribute rewards', async function () {
            const taskId = await tmf.redEntity.findHash(taskDetails1);
            await tmf.redEntity.connect(tmf.redCakeTaskOwner).verifyCompletion(taskId);
            const task = await tmf.redEntity.tasks(taskId);
            const status = await tmf.redEntity.taskAssignments(taskId, tmf.participant1.address);
            expect(task.isActive).to.equal(false);
            expect(status).to.equal(3);//VERIFIED
        });

    });

});