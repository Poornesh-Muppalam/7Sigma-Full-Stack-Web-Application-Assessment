const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const { io } = require('socket.io-client');

const storage = new Storage();

exports.processImage = async (event, context) => {
  const bucketName = event.bucket;
  const fileName = event.name;

  console.log(`📥 Received file: ${fileName}`);

  if (!fileName.endsWith('.jpg') && !fileName.endsWith('.png') && !fileName.endsWith('.jpeg')) {
    console.log('❌ Not an image file. Skipping.');
    return;
  }

  const tempLocalPath = `/tmp/${fileName}`;
  const processedFileName = `processed_${fileName}`;

  try {
    await storage.bucket(bucketName).file(fileName).download({ destination: tempLocalPath });
    const resizedBuffer = await sharp(tempLocalPath).resize(300).toBuffer();
    await storage.bucket(bucketName).file(processedFileName).save(resizedBuffer);

    console.log(`✅ Processed and uploaded: ${processedFileName}`);

    // 🔌 Emit "processing complete" via WebSocket to backend
    const socket = io(process.env.SOCKET_IO_SERVER_URL || 'http://localhost:5001', {
      auth: {
        token: process.env.CLOUD_FUNCTION_JWT || 'cloud-function-secret',
      },
    });

    socket.on('connect', () => {
      console.log('🌐 Connected to WebSocket server from Cloud Function');

      socket.emit('image_status', {
        status: 'Processing complete ✅',
        filename: processedFileName,
      });

      socket.disconnect();
    });

    socket.on('connect_error', (err) => {
      console.error('❌ WebSocket connection failed:', err.message);
    });

  } catch (error) {
    console.error('❌ Image processing failed:', error);
  }
};
