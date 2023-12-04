import React, {useState, useEffect} from 'react';
//import { Storage } from 'aws-amplify';
import { StorageManager,StorageImage } from '@aws-amplify/ui-react-storage';
//import {StorageManagerFileTypesExample} from './components/FileUploader';
import { Collection, ThemeProvider } from '@aws-amplify/ui-react';
//import {S3ProviderListOutpuItem} from "aws-amplify/storage"
import '@aws-amplify/ui-react/styles.css'
import './App.css';
import { list } from 'aws-amplify/storage';




const globalTheme = {
  name: 'my-theme',
  tokens: {
    borderWidths: {
      small: '2px',
    },
    components: {
      storagemanager: {
        dropzone: {
          borderColor: '{colors.primary.60}',
        },
      },
    },
  },
};

interface FileKey {
  file: File;
  key: string;
}


const App = () =>{
  const [photos, setPhotos] = useState([]);

  

  const processFile = async ({ file }) => {
    const fileExtension = file.name.split('.').pop();
  
    return file
      .arrayBuffer()
      .then((filebuffer) => window.crypto.subtle.digest('SHA-1', filebuffer))
      .then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((a) => a.toString(16).padStart(2, '0'))
          .join('');
        return { file, key: `${hashHex}.${fileExtension}` ,
        metadata: {
          id: `${hashHex}.${fileExtension}`,
        },};
      });
  };

  useEffect(() => {
    async function fetchPhotos() {
      try {
        // Fetch all files from the 'photos/' directory
        const response = await list({ 
          prefix: '',
          postfix: '.jpg',
          options: { 
            accessLevel: 'public', 
            listAll: true 
          } 
        });
        console.log('Listed Items:', response.items);
        // Filter and process the response to get photo URLs
        setPhotos(response.items.map(file => file.key)); // Assuming file has a URL attribute
        console.log('Photos:', photos);
      } catch (error) {
        console.error('Error fetching photos', error);
      }
    }

    fetchPhotos();
  }, []);

  useEffect(() => {
    console.log('Updated Photos:', photos);
  }, [photos]);

  return (
    <ThemeProvider theme={globalTheme}>
    <StorageManager
      acceptedFileTypes={[
        // you can list file extensions:
        //'.gif',
        //'.bmp',
        //'.doc',
        '.jpeg',
        '.jpg',
        // or MIME types:
        '.png',
      ]}
      accessLevel="guest"
      maxFileCount={5}
      autoUpload={false}
      // Size is in bytes
      maxFileSize={1000000}
      processFile={processFile}
      path="photos/"
      //onUploadSuccess={onSucess}
    />
    <div className="photo-gallery">
      <h1>Photo Gallery</h1>
      {photos.map(photo => (
        <StorageImage
          //alt={photo.key}
          //key={photo.key}
          imgKey={photo}
          accessLevel="public"
          style={{ width: '100%', height: '200px' }}
        />
      ))}
    </div>
    </ThemeProvider>
  )

}

export default App;