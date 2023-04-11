import { TBoiler } from '@app/types/TBoilers';
import { AppDispatch, RootState } from 'app/store/index';
import { selectUser } from 'app/store/userSlice';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { container, item } from '../../constants';
import reducer from '../../store';
import { getUserBoiler, selectBoilerById } from '../../store/userBoilersSlice';
import { Wrapper } from '../styled/BoilersStyled';
import { BoilersDetailHeader } from './UserBoilersDetailHeader';
import { BoilersDetailTable } from './UserBoilersDetailTable';
import { useReactToPrint } from 'react-to-print';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

const BoilersDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const boiler = id ? useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id)) : undefined;
  const { data: userData } = useSelector(selectUser);
  useEffect(() => {
    if (id && userData?.id) dispatch(getUserBoiler({ id: id, userId: userData?.id }));
  }, [id, dispatch]);

  const headerRef = useRef<HTMLDivElement>(null);
  const boilerDetailTableRef = useRef<HTMLDivElement>(null);
  const manualBoilerTableRef = useRef<HTMLDivElement>(null);

  const printBoilerDetailTable = useReactToPrint({
    content: () => {
      const printElem = document.createElement('div');
      const header = headerRef.current?.cloneNode(true) as HTMLDivElement;
      const table = boilerDetailTableRef.current?.cloneNode(true) as HTMLDivElement;
      printElem.appendChild(header);
      printElem.appendChild(table);
      return printElem;
    },
  });

  const printTable = useReactToPrint({
    content: () => {
      const printElem = document.createElement('div');
      const header = headerRef.current?.cloneNode(true) as HTMLDivElement;
      const table = manualBoilerTableRef.current?.cloneNode(true) as HTMLDivElement;
      printElem.appendChild(header);
      printElem.appendChild(table);
      return printElem;
    },
  });

  const generatePDF = async () => {
    // @ts-ignore
    const header = headerRef.current.cloneNode(true);
    // @ts-ignore
    const table = boilerDetailTableRef.current.cloneNode(true);

    const container = document.createElement('div');
    container.appendChild(header);
    container.appendChild(table);
    container.style.maxWidth = '1570px';
    container.querySelectorAll('.dont-print').forEach((button) => button.remove());
    document.body.appendChild(container);

    const canvas = await htmlToImage.toCanvas(container);
    const imgData = canvas.toDataURL('image/svg+xml', 1.0);
    const report = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      precision: 16,
    });
    report.addImage(
      imgData,
      'SVG',
      0,
      0,
      report.internal.pageSize.width,
      report.internal.pageSize.height - 70,
      '',
      'FAST'
    );

    report.save('report.pdf');
    document.body.removeChild(container);
  };
  return !boiler ? (
    <Wrapper header={<BoilersDetailHeader doesNotExist />} />
  ) : (
    <Wrapper
      header={<BoilersDetailHeader data={boiler} />}
      content={
        <div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-6 gap-24 w-full min-w-0 p-24"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="sm:col-span-6">
              <BoilersDetailTable generatePDF={generatePDF} printTable={printTable} boiler={boiler} id={id || ''} />
            </motion.div>
          </motion.div>
        </div>
      }
    />
  );
};

export default withReducer('userBoilers', reducer)(BoilersDetail);
