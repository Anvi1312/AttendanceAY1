# Personal Attendance Tracking System

A comprehensive personal attendance tracking web application with smart analytics, attendance matrix, and intelligent suggestions. Built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### ✅ Core Functionality
- **Daily Attendance Marking**: Mark Present/Absent/Cancelled for each scheduled class
- **Smart Calendar Navigation**: Select any date to mark or edit attendance
- **Delete/Reset Options**: Clear attendance for specific dates or subjects
- **Subject Drill-down**: Detailed view of attendance records for each subject

### 📊 Advanced Analytics
- **Attendance Matrix**: Complete analytics with Till-Date, Weekly, and Monthly breakdowns
- **Global Statistics**: Overall attendance percentage across all subjects
- **Subject-wise Performance**: Individual subject attendance tracking
- **Visual Charts**: Pie charts and bar graphs for better insights
- **Smart Suggestions**: Intelligent recommendations to reach 75% attendance target

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Clean Interface**: Modern design with intuitive navigation
- **Color-coded Subjects**: Visual distinction for different subjects
- **Interactive Charts**: Dynamic data visualization with Recharts
- **Smart Alerts**: Visual warnings for low attendance

### 📅 Weekly Timetable
- **Monday**: DIVP (1-2 PM), SOOAD (2-3 PM), AI (3-4 PM)
- **Tuesday**: AI (2-3 PM), PS (3-4 PM), DIVP Lab (4:15-6:15 PM)
- **Wednesday**: DIVP (2-3 PM), AI (3-4 PM), PPL Lab (4:15-6:15 PM)
- **Thursday**: DIVP (1-2 PM), PS (2-3 PM), CD (3-4 PM)
- **Friday**: DIVP (1-2 PM), SOOAD (2-3 PM), CD (3-4 PM), PPL Lab (4:15-6:15 PM)
- **Saturday**: SOOAD (1-2 PM), PS (2-3 PM), CD (3-4 PM), DIVP Lab (4:15-6:15 PM)

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite

## 📦 Setup Instructions

### 1. Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### 2. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API in your Supabase dashboard
3. Copy your Project URL and anon public key
4. Update the `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the database migration:
   - Go to the SQL Editor in Supabase
   - Copy and execute the SQL from `supabase/migrations/create_enhanced_attendance_table.sql`

### 3. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Build for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## 🚀 Deployment

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Add environment variables in Vercel dashboard

### Deploy to Netlify
1. Build: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

## 📊 Database Schema

The `attendance` table includes:
- `id`: Unique identifier (UUID)
- `date`: Date of attendance (DATE)
- `subject`: Subject name (TEXT)
- `status`: Present/Absent/Cancelled (TEXT with constraint)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## 🎯 Key Features Explained

### Attendance Matrix
- **Till-Date**: Complete attendance history
- **Weekly**: Current week performance
- **Monthly**: Current month statistics
- **Excludes Cancelled**: Smart calculation excluding cancelled sessions

### Smart Suggestions
- Calculates exact number of classes needed to reach 75%
- Adapts dynamically based on current attendance
- Provides subject-specific and global recommendations

### Subject Management
- Color-coded subjects for easy identification
- Individual subject performance tracking
- Detailed attendance history for each subject
- Visual progress indicators

## 🔒 Security

- Row Level Security (RLS) enabled
- Public access configured for single-user application
- Environment variables for sensitive data
- Secure API endpoints through Supabase

## 📱 Mobile Responsive

- Optimized for all screen sizes
- Touch-friendly interface
- Collapsible sidebar navigation
- Mobile-first design approach

## 🎨 Design System

- **Primary Colors**: Blue (#3B82F6) and white
- **Status Colors**: Green (Present), Red (Absent), Orange (Cancelled)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable, modular design components

## 📈 Analytics Features

- **Global Attendance Percentage**: Overall performance tracking
- **Subject-wise Breakdown**: Individual subject analysis
- **Visual Charts**: Pie charts and bar graphs
- **Period Filtering**: View data by week, month, or all-time
- **Export Functionality**: CSV export for external analysis

## 🔧 Customization

The application is designed for personal use and can be easily customized:
- Modify `src/lib/schedule.ts` to update the weekly timetable
- Adjust colors in `SUBJECT_COLORS` for different visual themes
- Update attendance thresholds in the analytics calculations
- Customize the UI components for different layouts

## 📞 Support

This is a personal project designed for individual use. For issues or customizations, refer to the code documentation and comments within the source files.

---

Built with ❤️ for efficient attendance tracking and academic success!