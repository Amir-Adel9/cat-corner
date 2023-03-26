import { IncomingForm } from 'formidable';
import { type NextApiRequest } from 'next';

export async function getPostData(req: NextApiRequest) {
  const data = await new Promise<{ postContent: string; imageBase64: string }>(
    function (resolve, reject) {
      const form = new IncomingForm({ keepExtensions: true });
      form.parse(req, function (err, fields) {
        if (err) return reject(err);
        resolve({
          postContent: fields.postContent as string,
          imageBase64: fields.imageBase64 as string,
        });
        console.log('fields', fields);
      });
    }
  );

  return data;
}
