
import Box from '@mui/material/Box'
import UploadFileButton from '../components/UploadFileButton'
import { useFileController } from '../controllers/useFileController'

function App() {
  const { addFile } = useFileController();

  return (
    <Box>
      <UploadFileButton fileUpload={addFile} />
    </Box>
  )
}

export default App
