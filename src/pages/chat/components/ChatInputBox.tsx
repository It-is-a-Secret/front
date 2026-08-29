import type {ComponentPropsWithoutRef} from 'react';

import {IcSvgPlus, IcSvgSend} from '@/shared/icons';

type ChatInputBoxInputProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'aria-label' | 'children' | 'onChange' | 'placeholder' | 'type' | 'value'
>;

interface ChatInputBoxProps extends Omit<
  ComponentPropsWithoutRef<'form'>,
  'children'
> {
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  inputProps?: ChatInputBoxInputProps;
  submitDisabled?: boolean;
}

export const ChatInputBox = ({
  placeholder = '메시지를 입력하세요',
  value,
  onValueChange,
  inputProps,
  submitDisabled,
  ...formProps
}: ChatInputBoxProps) => {
  return (
    <article className='mb-[2.6rem] px-[1.2rem] pt-[1.2rem]'>
      <form {...formProps} className='flex h-[4.4rem]'>
        <button
          type='button'
          aria-label='첨부하기'
          disabled={inputProps?.disabled}
          className='flex size-[4.4rem] items-center justify-center disabled:text-gray-400'>
          <IcSvgPlus width={24} height={24} />
        </button>

        <input
          {...inputProps}
          type='text'
          aria-label='메시지 입력'
          placeholder={placeholder}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className='text-input1-14r bg-primary-400 placeholder:text-white-800 flex-1 rounded-[4px] px-[1.6rem] py-[0.8rem] text-gray-800 outline-none disabled:bg-gray-200 disabled:text-gray-400 disabled:placeholder:text-white-800'
        />

        <button
          type='submit'
          aria-label='메시지 보내기'
          disabled={submitDisabled}
          className='flex size-[4.4rem] items-center justify-center disabled:text-gray-400'>
          <IcSvgSend width={24} height={24} />
        </button>
      </form>
    </article>
  );
};
