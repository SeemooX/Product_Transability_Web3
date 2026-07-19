export const CONTRACT_FUNCTIONS = [
  "function createProduct(bytes32 _productId, bytes32 _metadataHash, bytes32 _eventHash)",
  "function addTraceabilityEvent(bytes32 _productId, uint8 stepType, bytes32 _eventHash)",
  "function getProduct(bytes32 _productId) view returns (tuple(address manufacturer, bytes32 metadataHash, uint256 createdAt, bool exists, uint8 currentStatus))",
  "function getProductHistory(bytes32 _productId) view returns (tuple(uint8 stepType, address performedBy, bytes32 eventHash, uint256 timestamp)[])",
  "function verifyProduct(bytes32 _productId, bytes32 _metadataHash) view returns (bool)",
  "function productExists(bytes32 _productId) view returns (bool)",
  "function getCurrentStatus(bytes32 _productId) view returns (uint8)"
];