import { MutableRefObject, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useRef } from 'react';
import { Button } from '@mui/material';
interface Props {
  imageURL: string | null;
  setImageURL: React.Dispatch<React.SetStateAction<any>>;
}
function HandleSignature({ imageURL, setImageURL }: Props) {
  const [openModel, setOpenModal] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>();
  const [penColor, setPenColor] = useState('black');

  const create = () => {
    const URL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    setImageURL((prev) => ({ ...prev, imageURL: URL }));
    setOpenModal(false);
  };

  return (
    <div className="w-full">
      {imageURL && <img src={imageURL} alt="signature" className="signature mx-auto" />}

      <br />
      <Button onClick={() => setOpenModal(true)}>Podpísať</Button>
      {openModel && (
        <div className="modalContainer ">
          <div className="modal">
            <div className="sigPadContainer">
              <SignatureCanvas penColor={penColor} canvasProps={{ className: 'sigCanvas' }} ref={sigCanvas} />
              <hr />
              <Button onClick={() => sigCanvas.current.clear()}>Zmazať</Button>
            </div>

            <div className="modal__bottom">
              <Button onClick={create} color="primary">
                Hotovo
              </Button>
              <Button onClick={() => setOpenModal(false)} color="secondary">
                Zatvoriť
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HandleSignature;
