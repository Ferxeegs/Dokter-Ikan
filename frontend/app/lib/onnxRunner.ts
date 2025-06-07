// import * as ort from 'onnxruntime-web';

// let session: ort.InferenceSession | null = null;

// export async function loadModel(modelUrl: string) {
//   if (!session) {
//     session = await ort.InferenceSession.create(modelUrl);
//   }
//   return session;
// }

// export async function runModel(
//   inputData: ort.Tensor
// ): Promise<ort.InferenceSession.OnnxValueMapType> {
//   if (!session) throw new Error('Model belum dimuat');
//   const feeds = { input: inputData };
//   const results = await session.run(feeds);
//   return results;
// }
