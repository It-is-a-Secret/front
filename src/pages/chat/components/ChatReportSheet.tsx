import {REPORT_REASONS, useChatReport} from '@/pages/chat/hooks/useChatReport';
import type {ReportRequest} from '@/shared/api/moderation/type';
import {BottomSheet} from '@/shared/components/BottomSheet';
import {Button} from '@/shared/components/Button';

type ReportReason = ReportRequest['reason'];

interface ChatReportSheetProps {
  open: boolean;
  roomId: number;
  partnerId: number | undefined;
  onClose: () => void;
}

interface ReportReasonRadioProps {
  reason: ReportReason;
  label: string;
  checked: boolean;
  onChange: (reason: ReportReason) => void;
}

const ReportReasonRadio = ({
  reason,
  label,
  checked,
  onChange,
}: ReportReasonRadioProps) => {
  return (
    <label className='text-body1-15r flex items-center gap-[0.8rem] whitespace-nowrap text-gray-800'>
      <input
        type='radio'
        name='reportReason'
        value={reason}
        checked={checked}
        className='peer sr-only size-[2.4rem]'
        onChange={() => onChange(reason)}
      />
      <span className='relative size-[2rem] rounded-full border border-gray-800 peer-checked:border-gray-800 after:absolute after:top-1/2 after:left-1/2 after:size-[1.3rem] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full peer-checked:after:bg-gray-800' />
      {label}
    </label>
  );
};

export const ChatReportSheet = ({
  open,
  roomId,
  partnerId,
  onClose,
}: ChatReportSheetProps) => {
  const {
    selectedReason,
    setSelectedReason,
    detail,
    setDetail,
    isSubmitted,
    isPending,
    canSubmit,
    errorMessage,
    handleSubmit,
    handleClose,
  } = useChatReport({roomId, partnerId, onClose});

  return (
    <BottomSheet
      open={open}
      ariaLabel={isSubmitted ? '신고 접수 완료' : '사용자 신고'}
      onClose={handleClose}>
      {isSubmitted ? (
        <div className='flex flex-col items-center px-[1.2rem] pb-[3.6rem] text-center'>
          <img src='/report.png' alt='' className='size-[9.2rem]' />
          <h2 className='text-title-22b text-primary mt-[1.6rem] mb-[0.8rem]'>
            신고가 접수되었어요
          </h2>
          <p className='text-body1-15r mb-[2.8rem] whitespace-pre-line text-gray-600'>
            {
              '소중한 의견을 보내주셔서 감사해요\n신고 내용은 운영팀에서 꼼꼼히 확인할게요'
            }
          </p>
          <Button
            text='완료하기'
            className='bg-primary text-button1-14b text-white-800 h-[5.6rem] rounded-[28px] shadow-[0_8px_10px_0_rgba(194,30,86,0.25)]'
            onClick={handleClose}
          />
        </div>
      ) : (
        <div className='px-[1.2rem] pb-[3.6rem]'>
          <div className='text-center'>
            <h2 className='text-title-22b text-primary mb-[0.8rem]'>
              이 사용자를 신고할까요?
            </h2>
            <p className='text-body1-15r whitespace-pre-line text-gray-600'>
              {
                '신고 내용은 운영팀에서 확인하며\n상대방에게 신고 사실이 알려지지 않아요'
              }
            </p>
          </div>
          <div className='flex flex-col items-center px-[1.6rem]'>
            <fieldset
              disabled={isPending}
              className='mt-[2.9rem] grid w-full grid-cols-[max-content_max-content] gap-x-[3.5rem] gap-y-[2rem]'>
              <legend className='sr-only'>신고 사유</legend>
              {REPORT_REASONS.map(({value, label}) => (
                <ReportReasonRadio
                  key={value}
                  reason={value}
                  label={label}
                  checked={selectedReason === value}
                  onChange={setSelectedReason}
                />
              ))}
            </fieldset>

            <input
              value={detail}
              aria-label='신고 상세 내용'
              disabled={isPending}
              placeholder='내용을 입력해 주세요'
              className='text-input1-14r bg-white-800 mt-[0.8rem] h-[4.8rem] w-full rounded-[16px] border border-gray-200 px-[1.6rem] text-gray-800 outline-none placeholder:text-gray-400'
              onChange={(event) => setDetail(event.target.value)}
            />
          </div>

          {errorMessage && (
            <p
              role='alert'
              className='text-caption2-12sb mt-[1.2rem] text-center text-gray-600'>
              {errorMessage}
            </p>
          )}

          <div className='mt-[2.4rem] flex w-full gap-[0.8rem]'>
            <div className='flex-[1]'>
              <Button
                text='취소'
                disabled={isPending}
                className='border-primary text-button1-14b text-primary h-[5.6rem] rounded-[28px] border'
                onClick={handleClose}
              />
            </div>
            <div className='flex-[1.8]'>
              <Button
                text={isPending ? '접수 중...' : '신고하기'}
                className='bg-primary text-button1-14b text-white-800 h-[5.6rem] rounded-[28px] shadow-[0_8px_10px_0_rgba(194,30,86,0.25)]'
                disabled={!canSubmit}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </BottomSheet>
  );
};
