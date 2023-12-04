import { ThemeProvider } from '@aws-amplify/ui-react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import "@aws-amplify/ui-react/styles.css";

const theme = {
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

const processFile = ({ file, key }) => {
  return {
    file,
    key,
    metadata: {
      id: key,
    },
  };
};


export const StorageManagerFileTypesExample = () => {
  return (
    //<ThemeProvider theme={theme}>
    <StorageManager
      acceptedFileTypes={[
        // you can list file extensions:
        //'.gif',
        //'.bmp',
        //'.doc',
        '.jpeg',
        '.jpg',
        // or MIME types:
        'image/png',
        'video/*',
      ]}
      accessLevel="guest"
      maxFileCount={5}
      autoUpload={false}
      // Size is in bytes
      maxFileSize={1000000}
      processFile={processFile}
    />
    //</ThemeProvider>
  );
};

