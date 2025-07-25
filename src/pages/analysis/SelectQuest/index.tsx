import S from './style.module.css'

function SelectQuest() {
  return (
    <main className={S.container}>
      <section aria-label='퀘스트 선택 안내' className={S.intro}>
        <h2>퀘스트 선택</h2>
        <p>원하는 퀘스트를 선택해주세요.</p>
      </section>
    </main>
  )
}
export default SelectQuest