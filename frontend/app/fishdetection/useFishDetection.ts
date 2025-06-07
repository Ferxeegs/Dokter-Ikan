// // lib/fishDetection.ts
// import * as ort from 'onnxruntime-web';

// let session: ort.InferenceSession | null = null;

// export async function loadModel() {
//   if (!session) {
//     session = await ort.InferenceSession.create('/models/fish_species.onnx');
//   }
//   return session;
// }

// export async function runModel(inputTensor: ort.Tensor) {
//   if (!session) await loadModel();
//   const feeds = { input: inputTensor };
//   const results = await session!.run(feeds);
//   return results.output.data; // sesuaikan dengan output modelmu
// }
