export function readFileAsArrayBuffer(file, timeout = 1000) {
  return new Promise(((resolve, reject) => {
    const fileReader = new FileReader();
    const timer = setTimeout(() => {
      reject(new Error('read file time out.'));
    }, timeout);
    fileReader.onloadend = () => {
      clearTimeout(timer);
      resolve(fileReader.result);
    };
    fileReader.readAsArrayBuffer(file);
  }));
}

export async function dealWithFile(file) {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  console.log(arrayBuffer);
}
