import { TBoiler } from '@app/types/TBoilers';
import { AppDispatch, RootState } from 'app/store/index';
import { selectUser } from 'app/store/userSlice';
import withReducer from 'app/store/withReducer';
import { motion as m } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { container, item } from '../../constants';
import { boilersSlice, getBoilers, selectBoilerById } from '../../store/boilersSlice';
import { Wrapper } from '../styled/BoilersStyled';
import BoilerFooter from './BoilerFooter';
import { BoilersDetailHeader } from './BoilersDetailHeader';
import { BoilersDetailTable } from './BoilersDetailTable';
import { DailyNotesTable } from './DailyNotesTable';
import { ManualBoilerTable } from './ManualBoilerTable';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';
const BoilersDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { data: userData } = useSelector(selectUser);
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const isAdmin = userData?.role === 'admin';
  const isStaff = userData?.role === 'staff';
  useEffect(() => {
    if (isAdmin || isStaff) {
      dispatch(getBoilers());
    }
  }, [dispatch]);

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

  const printManualBoilerTable = useReactToPrint({
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

  return !isAdmin && !isStaff ? (
    <Navigate to="/404/" replace />
  ) : (
    <Wrapper
      header={<BoilersDetailHeader boiler={boiler} />}
      content={
        <div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
          <m.div
            className="grid grid-cols-1 sm:grid-cols-6 gap-24 w-full min-w-0 p-24"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <m.div variants={item} className="sm:col-span-6">
              {boiler && <BoilerFooter boiler={boiler} headerRef={headerRef} />}
            </m.div>
            <m.div variants={item} className="sm:col-span-6">
              <BoilersDetailTable
                id={id}
                componentRef={boilerDetailTableRef}
                generatePDF={generatePDF}
                printTable={printBoilerDetailTable}
              />
            </m.div>
            <m.div variants={item} className="sm:col-span-6">
              <ManualBoilerTable
                id={id}
                generatePDF={generatePDF}
                printTable={printManualBoilerTable}
                componentRef={manualBoilerTableRef}
              />
            </m.div>
            <m.div variants={item} className="sm:col-span-6">
              <DailyNotesTable id={id} />
            </m.div>
          </m.div>
        </div>
      }
    />
  );
};

export default withReducer('adminBoilers', boilersSlice.reducer)(BoilersDetail);
