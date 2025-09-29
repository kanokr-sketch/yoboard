import { useState, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BoardSidebar } from './components/BoardSidebar';
import { SearchBar } from './components/SearchBar';
import { MainBoard } from './components/MainBoard';
import { CreatePostDialog } from './components/CreatePostDialog';
import { CreateBoardDialog } from './components/CreateBoardDialog';
import { PostDetailModal } from './components/PostDetailModal';
import { Post, Category, Board } from './types';

// Sample initial boards and posts
const initialBoards: Board[] = [
  {
    id: 'eng-board',
    name: 'บอร์ดคณะวิศวกรรมศาสตร์',
    category: 'คณะ',
    description: 'ประกาศและกิจกรรมคณะวิศวกรรมศาสตร์',
    posts: []
  },
  {
    id: 'dorm-a-board',
    name: 'บอร์ดหอ A',
    category: 'หอใน',
    description: 'หาเพื่อนร่วมห้อง ขายของเก่า ประกาศต่างๆ',
    posts: []
  },
  {
    id: 'dorm-b-board',
    name: 'บอร์ดหอ B',
    category: 'หอใน',
    description: 'ชุมชนหอพักนักศึกษา B',
    posts: []
  },
  {
    id: 'music-club-board',
    name: 'บอร์ดชุมนุมดนตรี',
    category: 'คอมมูนิตี้',
    description: 'กิจกรรมและงานแสดงของชุมนุมดนตรี',
    posts: []
  },
  {
    id: 'inter-dorm-board',
    name: 'บอร์ดหออินเตอร์เนชั่นแนล',
    category: 'หออินเตอร์',
    description: 'หอพักนักศึกษาต่างชาติ',
    posts: []
  },
  {
    id: 'science-board',
    name: 'บอร์ดคณะวิทยาศาสตร์',
    category: 'คณะ',
    description: 'ประกาศคณะวิทยาศาสตร์',
    posts: []
  }
];

const initialPosts: Post[] = [
  {
    id: '1',
    title: 'งาน Open House คณะวิศวกรรมศาสตร์',
    author: 'นิสิตวิศวกรรม',
    description: 'มาร่วมงาน Open House คณะวิศวกรรมศาสตร์ ชมผลงานและกิจกรรมต่างๆ มากมาย',
    image: 'https://images.unsplash.com/photo-1741636174546-0d8c52a5aa00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwYnVsbGV0aW4lMjBib2FyZCUyMHBvc3RlcnxlbnwxfHx8fDE3NTkwODUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    contactLink: 'https://line.me/ti/p/@engineering',
    category: 'คณะ',
    boardId: 'eng-board',
    position: { x: 50, y: 100 },
    createdAt: new Date('2024-12-20')
  },
  {
    id: '2',
    title: 'หาเพื่อนร่วมห้อง หอ A',
    author: 'น้องมิ้น',
    description: 'หาเพื่อนร่วมห้องหอใน A ห้องพัดลม ราคาเดือนละ 2,500 บาท',
    image: 'https://images.unsplash.com/photo-1640146459297-eb4f1b084cc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZXZlbnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzU5MDg1MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    contactLink: 'tel:0812345678',
    category: 'หอใน',
    boardId: 'dorm-a-board',
    position: { x: 300, y: 150 },
    createdAt: new Date('2024-12-19')
  },
  {
    id: '3',
    title: 'คอนเสิร์ต Summer Music Festival',
    author: 'ชุมนุมดนตรี',
    description: 'เทศกาลดนตรีฤดูร้อน พบกับศิลปินดังมากมาย วันที่ 25-26 ธันวาคม',
    image: 'https://images.unsplash.com/photo-1689307181078-d05d73af61ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwcG9zdGVyJTIwZGVzaWdufGVufDF8fHx8MTc1OTA1NDQxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    contactLink: 'https://instagram.com/musicclub',
    category: 'คอมมูนิตี้',
    boardId: 'music-club-board',
    position: { x: 550, y: 80 },
    createdAt: new Date('2024-12-18')
  }
];

export default function App() {
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Update boards with posts
  const boardsWithPosts = useMemo(() => {
    return boards.map(board => ({
      ...board,
      posts: posts.filter(post => post.boardId === board.id)
    }));
  }, [boards, posts]);

  const handleCreatePost = (newPostData: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...newPostData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setPosts(prev => [...prev, newPost]);
  };

  const handleCreateBoard = (newBoardData: Omit<Board, 'id' | 'posts'>) => {
    const newBoard: Board = {
      ...newBoardData,
      id: `board-${Date.now()}`,
      posts: []
    };
    setBoards(prev => [...prev, newBoard]);
  };

  const handlePostPositionChange = (id: string, position: { x: number; y: number }) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, position } : post
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <BoardSidebar
          boards={boardsWithPosts}
          selectedBoard={selectedBoard}
          onBoardSelect={setSelectedBoard}
          onCreateBoard={() => setIsCreateBoardOpen(true)}
          searchQuery={searchQuery}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header with Search */}
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <SearchBar onSearch={setSearchQuery} />
              <div className="text-sm text-muted-foreground">
                วันนี้ {new Date().toLocaleDateString('th-TH', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Main Board */}
          <div className="flex-1 p-4">
            <MainBoard
              posts={posts}
              boards={boardsWithPosts}
              selectedBoard={selectedBoard}
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
              onPostClick={setSelectedPost}
              onPostPositionChange={handlePostPositionChange}
            />
          </div>
        </div>

        {/* Dialogs */}
        <CreatePostDialog
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
          onCreatePost={handleCreatePost}
          boards={boardsWithPosts}
          selectedBoard={selectedBoard}
        />

        <CreateBoardDialog
          isOpen={isCreateBoardOpen}
          onClose={() => setIsCreateBoardOpen(false)}
          onCreateBoard={handleCreateBoard}
        />

        <PostDetailModal
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      </div>
    </DndProvider>
  );
}