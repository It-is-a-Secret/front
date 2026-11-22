import {useRef, type ComponentPropsWithoutRef} from 'react';

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
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <article className='shrink-0 px-[0.8rem] pt-[0.8rem] pb-[max(1.2rem,env(safe-area-inset-bottom))]'>
      <form {...formProps} className='flex h-[4.4rem]'>
        <button
          type='button'
          aria-label='첨부하기'
          disabled={inputProps?.disabled}
          className='flex size-[4.4rem] shrink-0 items-center justify-center disabled:text-gray-400'>
          <IcSvgPlus width={24} height={24} />
        </button>

        <input
          {...inputProps}
          ref={inputRef}
          type='text'
          aria-label='메시지 입력'
          placeholder={placeholder}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className='bg-primary-400 placeholder:text-white-800 disabled:placeholder:text-white-800 min-w-0 flex-1 rounded-[4px] px-[1.2rem] py-[0.8rem] text-[16px] leading-[1.4] text-gray-800 outline-none disabled:bg-gray-200 disabled:text-gray-400'
        />

        <button
          type='submit'
          aria-label='메시지 보내기'
          disabled={submitDisabled}
          onPointerDown={(event) => {
            // 전송 버튼으로 포커스가 옮겨지면 모바일 키보드가 닫힙니다.
            if (
              event.button === 0 &&
              event.currentTarget.ownerDocument.activeElement ===
                inputRef.current
            ) {
              event.preventDefault();
            }
          }}
          className='flex size-[4.4rem] shrink-0 items-center justify-center disabled:text-gray-400'>
          <IcSvgSend width={24} height={24} />
        </button>
      </form>
    </article>
  );
};
