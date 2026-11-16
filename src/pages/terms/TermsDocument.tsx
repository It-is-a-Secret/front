import terms from './terms.md?raw';

const [title, ...articles] = terms.trim().split(/^## /m);
const sections = articles.map((article) => {
  const [heading, ...blocks] = article.trim().split(/\n{2,}/);
  return {heading, blocks: blocks.filter((block) => block !== '---')};
});

export const TermsDocument = () => (
  <article
    aria-labelledby='terms-title'
    className='text-gray-800 pt-[2.4rem] pb-[calc(3.2rem+env(safe-area-inset-bottom))]'>
    <h2 id='terms-title' className='text-title-22b'>
      {title.trim().slice(2)}
    </h2>
    <div className='divide-y divide-gray-100'>
      {sections.map(({heading, blocks}) => (
        <section key={heading} className='space-y-[1.2rem] py-[2rem]'>
          <h3 className='text-title-18b'>{heading}</h3>
          <div className='text-body1-15r text-gray-600 space-y-[1.2rem] wrap-anywhere break-keep'>
            {blocks.map((block) =>
              block.startsWith('- ') ? (
                <ul key={block} className='list-disc space-y-[0.4rem] ps-[2rem]'>
                  {block.split('\n').map((item) => (
                    <li key={item}>{item.slice(2)}</li>
                  ))}
                </ul>
              ) : (
                <p key={block}>
                  {block.split('`').map((text, index) =>
                    index % 2 === 0 ? text : <code key={text}>{text}</code>
                  )}
                </p>
              )
            )}
          </div>
        </section>
      ))}
    </div>
  </article>
);
