import FuseSvgIcon from '@app/core/SvgIcon';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import { forwardRef } from 'react';
import ContactModel from '../../model/ContactModel';
import HeaterInput from './HeaterInput';

const ContactHeaterSelector = forwardRef(({ value, onChange, className }, ref) => {
  console.log(value);
  return (
    <div className={clsx('w-full', className)} ref={ref}>
      {value.map((item, index) => (
        <HeaterInput
          value={item}
          key={index}
          onChange={(val) => {
            onChange(value.map((_item, _index) => (index === _index ? val : _item)));
          }}
          onRemove={(val) => {
            onChange(value.filter((_item, _index) => index !== _index));
          }}
          hideRemove={value.length === 1}
        />
      ))}
      <Button
        className="group inline-flex items-center mt-2 -ml-4 py-2 px-4 rounded cursor-pointer"
        onClick={() => onChange([...value, ContactModel().heaters[0]])}
      >
        <FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>

        <span className="ml-8 font-medium text-secondary group-hover:underline">Pridať kotol</span>
      </Button>
    </div>
  );
});

export default ContactHeaterSelector;
