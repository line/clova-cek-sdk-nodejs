import verifier from '../src/verifier';

describe('', () => {
  const requestBody =
    '{"version":"1.0","session":{"new":true,"sessionAttributes":{},"sessionId":"606548d7-c0d7-47a8-a696-fe9b8b77796e","user":{"userId":"Tda7Ron7Rn-2BZdXp10uvg"}},"context":{"System":{"application":{"applicationId":"com.chens.morning"},"device":{"deviceId":"80c6ddd0ee45c77ab3ffc29381b4f328aa466b7b3e0b25b60a35b965fa9ab844","display":{"size":"none","contentLayer":{"width":0,"height":0}}},"user":{"userId":"Tda7Ron7Rn-2BZdXp10uvg"}}},"request":{"type":"LaunchRequest","requestId":"e6736120-9571-4372-b97c-2656566595fc","timestamp":"2018-07-03T04:20:01Z","locale":"ja-JP","extensionId":"com.chens.morning","intent":{"intent":"","name":"","slots":null},"event":{"namespace":"","name":"","payload":null}}}';

  const validSignature =
    'qzaLUJwe1g4CPK7P02hXRD9Gr5/+JC5bJl93134mA4QIYBm1zzfFkRgZZVzgyhGN6YW5vRjFIM6bNcfylWQgs3VYTYnUXrRbqh9dWzuMVyOE2z59TfVH9h+jsacvSI2agZ/zy7Wln3D5vAreEU0IbS6Hh/FXQZAGpHJB1Ve1ZMXc8qb9qYSVDxtqqFJ1WLOHBzJ5XZ+OXPiZlcN7H17Q07o28AweDGrTLcbwk15kbFdmUnZPIxUyuPinT75tlsqCIiGbIlYuzPN/vjAYE9A1SGFU5R6GJjeZvDdf26VSmpgXy2GP4yZTnB+4AU4P6D0Hl/9Y4i6txkKHcBpnjLoKkg==';

  const validApplicationId = 'com.chens.morning';

  it('should pass signature and appilcation id verification', async () => {
    expect(verifier(validSignature, validApplicationId, requestBody)).resolves.toEqual(JSON.parse(requestBody));
  });

  it('should throw missing signature error', async () => {
    expect(verifier('', validApplicationId, requestBody)).rejects.toEqual(new Error('Missing signature.'));
  });

  it('should throw missing application id error', async () => {
    expect(verifier(validSignature, '', requestBody)).rejects.toEqual(new Error(`Missing applicationId.`));
  });

  it('should throw missing requestBody error', async () => {
    expect(verifier(validSignature, validApplicationId, '')).rejects.toEqual(new Error('Missing requestBody.'));
  });

  it('should throw invalid signature error', async () => {
    const invalidSignature = 'some-invalid-signature';

    expect(verifier(invalidSignature, validApplicationId, requestBody)).rejects.toEqual(
      new Error(`Invalid signature: "${invalidSignature}".`),
    );
  });

  it('should throw invalid applicationId error', async () => {
    const invalidApplicationId = 'some-invalid-applicationId';

    expect(verifier(validSignature, invalidApplicationId, requestBody)).rejects.toEqual(
      new Error(`Invalid application id: ${invalidApplicationId}.`),
    );
  });
});
