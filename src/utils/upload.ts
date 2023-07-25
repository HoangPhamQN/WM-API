import { Injectable } from '@nestjs/common';
import { Multer } from 'multer';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import 'firebase/storage';

@Injectable()
export class FirebaseService {
  async uploadImage(file: Multer.File): Promise<string> {
    const filename = `${file.originalname}-${Date.now()}`;
    const storage = getStorage();
    const storageRef = ref(storage, `images/${filename}`);
    await uploadBytes(storageRef, file?.buffer);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }
}
