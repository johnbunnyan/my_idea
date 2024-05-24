import React, { useState, useEffect } from 'react';

const MemoPage = () => {
  const [memo, setMemo] = useState('');
  const [savedMemoList, setSavedMemoList] = useState([]);
  const [memoPoint, setMemoPoint] = useState(0);
  const [alert, setAlert] = useState('');

  useEffect(() => {
    try {
      // 로컬 스토리지에서 memoPoint를 가져옴
      const savedMemoPoint = localStorage.getItem('memoPoint');
      if (savedMemoPoint !== null) {
        setMemoPoint(parseInt(savedMemoPoint, 10));
      }

      // 로컬 스토리지에서 저장된 메모 리스트를 가져옴
      const savedMemo = localStorage.getItem('savedMemoList');
      if (savedMemo !== null) {
        setSavedMemoList(JSON.parse(savedMemo));
      }
    } catch (error) {
      console.error('Error loading data from localStorage', error);
    }
  }, []);

  const handleMemoChange = (event) => {
    setMemo(event.target.value);
  };

  const handleSaveMemo = () => {
    // memoPoint가 0보다 큰 경우에만 메모를 저장하고 포인트를 차감
    if (memoPoint > 0) {
      const newMemo = { text: memo, color: `#${Math.floor(Math.random() * 16777215).toString(16)}` };
      const updatedMemoList = [newMemo, ...savedMemoList];
      setSavedMemoList(updatedMemoList);
      setMemo('');
      setMemoPoint(memoPoint - 1);

      // 로컬 스토리지에 메모 리스트를 저장
      localStorage.setItem('savedMemoList', JSON.stringify(updatedMemoList));
      localStorage.setItem('memoPoint', (memoPoint - 1).toString());
    } else {
      // 포인트가 부족한 경우 알람 표시
      setAlert('Not enough memo points!');
      setTimeout(() => {
        setAlert('');
      }, 3000);
    }
  };

  return (
    <div>
      <h1>Memo Page</h1>
      <div>
        <h2>Memo Point: {memoPoint}</h2>
      </div>
      <textarea value={memo} onChange={handleMemoChange} />
      <br />
      
      <button onClick={handleSaveMemo}>Save Memo</button>
      {alert && <p style={{ color: 'red' }}>{alert}</p>}
      <div>
        <h2>Saved Memo:</h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {savedMemoList.map((savedMemo, index) => (
            <div key={index} style={{ backgroundColor: savedMemo.color }}>
              <p>{savedMemo.text}</p>
            </div>
          ))}
        </div>
      </div>
    
    </div>
  );
};

export default MemoPage;
