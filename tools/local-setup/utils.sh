start_docker() {
    docker compose up -d
    
    while ! curl -s http://localhost:8000/health > /dev/null; do
        echo "Waiting for Graph Node to be ready..."
        sleep 5
    done
    echo "Docker services are ready!"
}

deploy_contract() {
    pnpm deployContract
}

update_subgraph() {
    SCRIPT_PATH=$(realpath "$0")

    YAML_FILE="../../apps/subgraph/subgraph.yaml"
    JSON_FILE="../deploy/deployments/contracts.json"


   NEW_ACCESS_MANAGER_ADDRESS=$(jq -r '.accessManagerV2.address' "$JSON_FILE")
    NEW_ACCESS_MANAGER_START_BLOCK=$(jq -r '.accessManagerV2.startBlock' "$JSON_FILE")

     NEW_REWARD_TOKEN_ADDRESS=$(jq -r '.rewardToken.address' "$JSON_FILE")
    NEW_REWARD_TOKEN_START_BLOCK=$(jq -r '.rewardToken.startBlock' "$JSON_FILE")

    NEW_ENTITY_TASK_ADDRESS=$(jq -r '.entity.address' "$JSON_FILE")
    NEW_ENTITY_TASK_START_BLOCK=$(jq -r '.entity.startBlock' "$JSON_FILE")

        # Debugging to check values
    echo "AccessManagerV2 Address: $NEW_ACCESS_MANAGER_ADDRESS"
    echo "RewardToken Address: $NEW_REWARD_TOKEN_ADDRESS"
    echo "Entity Contract Address: $NEW_ENTITY_TASK_ADDRESS"
    
  

    # Update the address and startBlock for accessManagerV2
    # sed -i "s/address: .*/address: \"$NEW_ACCESS_MANAGER_ADDRESS\"/g" $YAML_FILE
  
 
    

  
}

deploy_subgraph() {
    pnpm graph:codegen
    pnpm graph:build
    pnpm graph:create-local
    pnpm graph:deploy-local
}
