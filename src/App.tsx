import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DateSelector } from './components/DateSelector';
import { DailySchedule } from './components/DailySchedule';
import { Dashboard } from './components/Dashboard';
import { SubjectDetails } from './components/SubjectDetails';

function App() {
  const [activeTab, setActiveTab] = useState<'daily' | 'dashboard' | 'subjects'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'daily' && (
        <>
          <DateSelector 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
          />
          <DailySchedule selectedDate={selectedDate} />
        </>
      )}
      
      {activeTab === 'dashboard' && <Dashboard />}
      
      {activeTab === 'subjects' && <SubjectDetails />}
    </Layout>
  );
}

export default App;