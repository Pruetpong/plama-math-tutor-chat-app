
import React, { useState, useEffect } from 'react';
import { MATH_CURRICULUM } from '../curriculum';

interface SetupPageProps {
  onSetupComplete: (grade: string, topic: string) => void;
}

const gradeLevels = Object.keys(MATH_CURRICULUM);
type GradeLevel = keyof typeof MATH_CURRICULUM;

export const SetupPage: React.FC<SetupPageProps> = ({ onSetupComplete }) => {
  const [grade, setGrade] = useState<GradeLevel>(gradeLevels[0] as GradeLevel);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    // Automatically set the topic to the first one available for the selected grade.
    if (grade && MATH_CURRICULUM[grade]?.length > 0) {
      setTopic(MATH_CURRICULUM[grade][0]);
    }
  }, [grade]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (grade && topic) {
        onSetupComplete(grade, topic);
    }
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGrade(e.target.value as GradeLevel);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ตั้งค่าการเรียน</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">เลือกชั้นเรียนและหัวข้อเพื่อเริ่มใช้งาน PLAMA</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="grade"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                ระดับชั้น
              </label>
              <select
                id="grade"
                name="grade"
                value={grade}
                onChange={handleGradeChange}
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg dark:text-white"
              >
                {gradeLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="topic"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                หัวข้อ
              </label>
              <select
                id="topic"
                name="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg dark:text-white"
              >
                {MATH_CURRICULUM[grade]?.map((topicItem) => (
                    <option key={topicItem} value={topicItem}>{topicItem}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              เริ่มเรียน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
