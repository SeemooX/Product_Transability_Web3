// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ProductTracking {
    enum Status {
        CREATED,
        PICKED_UP,
        DELIVERED_TO_WAREHOUSE,
        RECEIVED_AT_WAREHOUSE,
        READY_FOR_DISPATCH,
        DELIVERED_TO_STORE,
        AVAILABLE_FOR_SALE
    }
    

    struct TraceabilityEvent  {
        Status stepType;
        address performedBy;
        bytes32 eventHash;
        uint256 timestamp;
    }

    struct Product {
        address manufacturer;
        bytes32 metadataHash;
        uint256 createdAt;
        bool exits;
        Status currentStatus;
    }


    event ProductCreated(
        bytes32 indexed productId,
        address indexed manufacturer,
        bytes32 metadataHash,
        uint256 createdAt
    );

    event TraceabilityEventAdded(
        bytes32 indexed productId,
        Status stepType,
        address indexed performedBy,
        bytes32 eventHash,
        uint256 timestamp
    );


    mapping(bytes32 -> Product) products; /* productId  -> product */
    mapping(bytes32 -> TraceabilityEvent[]) productHistory; /* productId  -> history */


    function createProduct(bytes32 _productId, bytes32 _metadataHash, bytes32 _eventHash) external {
        require(_productId != bytes32(0), "Empty productID paramater");
        require(products[_productId].exists != true, "This product already exists");

        products[_productId].manufacturer = msg.sender;
        products[_productId].metadataHash = _metadataHash; 
        products[_productId].createdAt = block.timestamp; 
        products[_productId].exists = true; 
        products[_productId].currentStatus = Status.CREATED;

        addTraceabilityEvent(_productId, Status.CREATED, _eventHash);

        emit ProductCreated(
            _productId,
            msg.sender,
            _metadataHash,
            block.timestamp
        );
    }

    function addTraceabilityEvent(bytes32 _productId, Status stepType, bytes32 _eventHash) public {
        require(products[_productId].exists, "Product does not exists");

        products[_productId].currentStatus = stepType;

        TraceabilityEvent memory trackingEvent;
        
        trackingEvent.stepType = stepType;
        trackingEvent.performedBy = msg.sender;
        trackingEvent.eventHash = _eventHash;
        trackingEvent.timestamp = block.timestamp;

        productHistory[_productId].push(trackingEvent);


        emit TraceabilityEventAdded(
            _productId,
            stepType,
            msg.sender,
            _eventHash,
            block.timestamp
        );
    }
}