import type { Planet } from '../types/Flash.ts'

const HOUSE_MAP_IMAGE = './assets/photos/house/house.png';

export const PLANETS_DATA: Planet[] = [
  {
    id: 'planet-orange',
    name: 'Hành Tinh Mèo Mups',
    subtitle: 'Khu dân cư của hội mèo cam mập mạp',
    thumb: '/assets/photos/planet/cat_planet.png',
    mapBg: HOUSE_MAP_IMAGE,
    borderColor: 'border-amber-400',
    cats: [
      { id: 'cat-1', name: 'Trần Hà Linh', image: 'https://i.pinimg.com/1200x/33/33/43/3333433e712f28c122bd8e9cde8e1eac.jpg', 
        meme: 'Nổi tiếng nhờ ...',value: '53M', stats: {
          'Độ Mups': 99,
          'Bán Kính': 93,
          'Lực Đập': 96,
          'Vợ': 95,
          'Vắt': 99, } , } ,
        
      { id: 'cat-2', name: 'Lan Xinh Yêu', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0sLejFnggdDmfGJowi1sjw7jP8gEwzTat6FslyYc-VGDcbVUJS1SRQUw&s=10', 
        meme: 'Bằng cái chảo.',value: '110M', stats: {
          'Độ Mups': 91,
          'Bán Kính': 88,
          'Lực Đập': 99,
          'Vợ': 95,
          'Vắt': 95, } , },

      { id: 'cat-3', name: 'Ngọc Kem', image: 'https://i.pinimg.com/736x/8f/8e/3b/8f8e3b1bef31026854c055bd81929464.jpg', 
        meme: 'Vận động viên gym bất đắc dĩ, mỗi lần chỉ tập được 5 giây.',value: '32M', stats: {
          'Độ Mups': 91,
          'Bán Kính': 88,
          'Lực Đập': 93,
          'Vợ': 83,
          'Vắt': 84, } , },

      { id: 'cat-4', name: 'Hoàng Lan Anh', image: 'https://i.pinimg.com/736x/c7/1c/85/c71c85ee28e82d16ae51e8710083a6b1.jpg', 
        meme: 'Fan cứng của tivi, đặc biệt là mấy show có chim.',value: '67M', stats: {
          'Độ Mups': 90,
          'Bán Kính': 89,
          'Lực Đập': 80,
          'Vợ': 84,
          'Vắt': 83, } , },

      { id: 'cat-5', name: 'Ciin', image: 'https://i.pinimg.com/736x/28/0c/30/280c3025f1238fdb1ec321fa4688b4cd.jpg', 
        meme: 'Fan cứng của tivi, đặc biệt là mấy show có chim.' ,value: '200M', stats: {
          'Độ Mups': 94,
          'Bán Kính': 95,
          'Lực Đập': 84,
          'Vợ': 89,
          'Vắt': 81, } , },
      
      { id: 'cat-6', name: 'Quỳnh Bei', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwA0mONWWRzk1hxiH1XY7mX7eURPlfEZ_PC5Cqe8UcSNO9yqqeOgPQaXk&s=10', 
        meme: 'Fan cứng của tivi, đặc biệt là mấy show có chim.',value: '150M', stats: {
          'Độ Mups': 90,
          'Bán Kính': 95,
          'Lực Đập': 98,
          'Vợ': 97,
          'Vắt': 99, } , },
    ],
    total_price : '1 Billion'
  },
  {
    id: 'planet-black',
    name: 'Hành Tinh Tuất',
    subtitle: 'Nơi cư ngụ của hội tuất bí ẩn',
    thumb: '/assets/photos/planet/dog_planet.png',
    mapBg: HOUSE_MAP_IMAGE,
    borderColor: 'border-purple-400',
    cats: [
      { id: 'dog-1', name: 'Bốp Bốp', image: 'https://i.pinimg.com/736x/d0/ab/09/d0ab09962dce5ada721bcc1180d32f19.jpg', 
        meme: '100 ngày thay đổi bản thân.' ,value: '10K', stats: {
          'Độ Hợi': 90,
          'Khô ': 66,
          'Chơi Ngu': 79,
          'Lọ chéo': 95,
          'Bá Khí': 88, }, },

      { id: 'dog-2', name: 'Tài Enzo', image: 'https://i.pinimg.com/736x/6b/87/0c/6b870c96b36f9ca6147024eba82eafc1.jpg', 
        meme: 'Đánh ngu nhưng đỡ hơn thằng Bình.' ,value: '12K', stats: {
          'Độ Hợi': 57,
          'Khô ': 70,
          'Chơi Ngu': 50,
          'Lọ chéo': 95,
          'Bá Khí': 99, },},

      { id: 'dog-3', name: 'Trần Bình', image: 'https://i.pinimg.com/736x/e2/b8/1c/e2b81cb9952990080eb7aac04ea1d67a.jpg', 
        meme: 'Bậc thầy game thủ, nhưng hết thời.' ,value: '22K', stats: {
          'Độ Hợi': 45,
          'Khô ': 10,
          'Chơi Ngu': 97,
          'Lọ chéo': 95,
          'Bá Khí': 99, },},

      { id: 'dog-4', name: 'Mạnh Cường', image: 'https://i.pinimg.com/736x/ff/f4/fa/fff4fa646b76d4d297c9e3c1c4097338.jpg', 
        meme: 'Ngu nhất trong tứ đại xúc lô.' ,value: '1K', stats: {
          'Độ Hợi': 49,
          'Khô ': 98,
          'Chơi Ngu': 98,
          'Lọ chéo': 95,
          'Bá Khí': 99, },},
    ],
        total_price : '45K'

  },
  {
    id: 'planet-calico',
    name: 'Hành Tinh của các chủ công 11A1',
    subtitle: 'Cộng đồng ki pháo cực gắt',
    thumb: '/assets/photos/planet/volleyball.png',
    mapBg: HOUSE_MAP_IMAGE,
    borderColor: 'border-pink-400',
    cats: [
      { id: 'per-1', name: 'Sang Le', image: 'https://cdn.phototourl.com/member/2026-10-04-a0d80a08-c483-4e6a-9921-00816d0f732d.jpg', 
        meme: 'Người con Malai xa xứ với kĩ năng đập như đầu ba.' ,value: '1 Cent', stats: {
          'Da Đen': 95,
          'Khô ': 89,
          'Lực Đập': 93,
          'Libero': 70,
          'Bá Khí': 99, },},

      { id: 'per-2', name: 'Hào Milk', image: 'https://cdn.phototourl.com/member/2026-10-04-6ec2ad28-f6dd-4710-ab23-7e239d833cea.jpg',
        meme: 'Truyền nhân chú bảo vệ, chủ công 11A1 năm nay.' ,value: '254M', stats: {
          'Da Đen': 79,
          'Khô ':  99,
          'Lực Đập': 79,
          'Libero': 78,
          'Bá Khí': 84, },},

      { id: 'per-3', name: 'Danh Xụi', image: 'https://cdn.phototourl.com/member/2026-10-04-18bfd01f-62f7-4e6b-ac50-251bb335e73c.jpg',
        meme: 'Nhập tịch không thành công nhưng vẫn là anh em.',value: '21M' , stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 78,
          'Libero': 95,
          'Bá Khí': 75, },},

      { id: 'per-4', name: 'Gia Hào Mướn', image: 'https://cdn.phototourl.com/member/2026-09-08-bcd02c03-e96c-45f4-a8a9-d636d488b0b7.jpg', 
        meme: 'Nghỉ hè đi làm công ty biệt tích 3 tháng.',value: '30K VND', stats: {
          'Da Đen': 60,
          'Khô ': 67,
          'Lực Đập': 90,
          'Libero': 95,
          'Bá Khí': 98, }, },

      { id: 'per-5', name: 'Dâm La', image: 'https://cdn.phototourl.com/free/2026-09-08-0c32eebe-1105-4308-805c-11f15976f836.jpg', 
        meme: 'Đường đời đưa đẩy đi đụ đỉ, chủ công miền Nam.' ,value: '976B', stats: {
          'Da Đen': 99,
          'Khô ': 99,
          'Lực Đập': 99,
          'Libero': 99,
          'Bá Khí': 99, },},
        
      { id: 'per-6', name: 'Quan Lợm', image: 'https://cdn.phototourl.com/free/2026-09-08-a3a126c3-cc4d-4565-9906-75d78e70f9c2.jpg', 
        meme: 'Nhỏ con nhưng đập cũng như lồn luôn, mê xe độ.' ,value: '576B', stats: {
          'Da Đen': 50,
          'Khô ': 99,
          'Lực Đập': 40,
          'Libero': 84,
          'Bá Khí': 94, },},

      { id: 'per-7', name: 'Vua Đinh', image: 'https://cdn.phototourl.com/member/2026-09-08-52423e0c-a104-463d-9da3-b651681592f9.jpg', 
        meme: 'Khi đã là vua, chết vẫn là vua, vi vua da den.' ,value: 'Free', stats: {
          'Da Đen': 99,
          'Khô ': 89,
          'Lực Đập': 80,
          'Libero': 83,
          'Bá Khí': 200, },},

      { id: 'per-8', name: 'Huy sợ ma lắm', image: 'https://cdn.phototourl.com/member/2026-10-04-8b427ee2-1c8f-42bb-ae8c-029e05db2b47.jpg', 
        meme: 'Đập hay nhưng quên cắt móng tay.',value: '21M', stats: {
          'Da Đen': 60,
          'Khô ': 95,
          'Lực Đập': 80,
          'Libero': 95,
          'Bá Khí': 86, }, },
    ],
    total_price : '1,550 billion'
  },
   {
    id: 'planet-classmate',
    name: 'Hành Tinh 11A1',
    subtitle: 'Khu dân cư của hội mèo cam mập mạp',
    thumb: '/assets/photos/planet/11a1.png',
    mapBg: HOUSE_MAP_IMAGE,
    borderColor: 'border-slate-200',
    cats: [
      { id: 'f-1', name: 'Park Ji Tân', image: 'https://i.pinimg.com/736x/df/33/42/df3342d189242e678d4eb151c746547e.jpg', 
        meme: 'Chuyên gia Libero, không bao giờ từ chối một bữa ăn nào.',value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, }, },

      { id: 'f-2', name: 'Khánh Down', image: 'blob:https://chat.zalo.me/b4820770-c89d-41b7-b4cb-d1b7ea5453a6', 
        meme: 'Ngủ 20 tiếng một ngày, 4 tiếng còn lại để suy nghĩ về đồ ăn.' ,value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, },},

      { id: 'f-3', name: 'Hào Milk no Chill', image: 'https://i.pinimg.com/736x/55/74/22/5574223f43b98b8de093459157989133.jpg', 
        meme: 'Vận động viên gym bất đắc dĩ, mỗi lần chỉ tập được 5 giây.',value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, }, },

      { id: 'f-4', name: 'Gia Hào', image: 'https://i.pinimg.com/736x/a6/e7/33/a6e733493850f58f6968a9bc46bd66b7.jpg', 
        meme: 'Fan cứng của tivi, đặc biệt là mấy show có chim.' ,value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, },},

      { id: 'f-5', name: 'Huy sợ ma lắm', image: 'https://i.pinimg.com/736x/ff/22/1c/ff221c9f8ab7e3a8efec7bf10cb83827.jpg', 
        meme: 'Fan cứng của tivi, đặc biệt là mấy show có chim.',value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, },},

      { id: 'f-6', name: 'Dâm La', image: 'https://i.pinimg.com/736x/c0/fa/d8/c0fad8a4934c4fbd4b72122f05996941.jpg', 
        meme: 'Fan cứng của tivi, đặc biệt là mấy show có chim.',value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, }, },

      { id: 'f-7', name: 'Sang Lee', image: 'https://i.pinimg.com/736x/9f/a8/70/9fa870e927734eefb69aa42e6b632a32.jpg', 
        meme: 'Fan cứng của tivi, đặc biệt là mấy show có chim.',value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, }, },

      { id: 'f-8', name: 'Fuc Thịnh', image: 'https://i.pinimg.com/1200x/cf/a5/80/cfa580c072654e5d7b4feef522ecd771.jpg', 
        meme: 'Fan cứng của tivi, đặc biệt là mấy show có chim.',value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, }, },

      { id: 'f-9', name: 'Lợm em', image: 'https://i.pinimg.com/736x/87/7e/f5/877ef5b5bddede6327c293d425b8624c.jpg', 
        meme: 'Fan cứng của tivi, đặc biệt là mấy show có chim.',value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, }, },

      { id: 'f-10', name: 'Các què 17', image: 'https://i.pinimg.com/736x/4e/da/89/4eda89a72680aa684e40583608ffda51.jpg', 
        meme: 'Fan cứng của tivi, đặc biệt là mấy show có chim.',value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, }, },

      { id: 'f-11', name: 'Thầy cúng', image: 'https://i.pinimg.com/736x/f3/58/7d/f3587d75aec74c8365622754a1b2048a.jpg', 
        meme: 'Fan cứng của tivi, đặc biệt là mấy show có chim.',value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, }, },
    ],
    total_price : '1.55 trillion'

  },
   {
    id: 'planet-tech',
    name: 'Hành Tinh IT',
    subtitle: 'Khu dân cư của hội mèo cam mập mạp',
    thumb: '/assets/photos/planet/it.png',
    mapBg: HOUSE_MAP_IMAGE,
    borderColor: 'border-cyan-400',
    cats: [
      { id: 'cat-1', name: 'Ms.Thi', image: 'https://i.pinimg.com/736x/60/ef/ce/60efce51d9a3e1fb96b5f625df7d306d.jpg', 
        meme: 'Unknown.',value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, }, },

      { id: 'cat-2', name: 'Kiều An', image: 'https://i.pinimg.com/1200x/35/2a/60/352a6025ce84c25f7b9eb64fce3f1b3d.jpg', 
        meme: 'Unknown.',value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, }, },

      { id: 'cat-3', name: 'Minh Thiện', image: 'https://i.pinimg.com/736x/0f/20/2a/0f202a9b764a37c5c3718e2711f760c3.jpg', 
        meme: 'Unknown.',value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, }, },

      { id: 'cat-4', name: 'Duy Tân', image: 'https://i.pinimg.com/736x/2b/69/18/2b6918d3639f21c08d82b5c02d0f0a1f.jpg', 
        meme: 'Unknown.',value: '0', stats: {
          'Da Đen': 90,
          'Khô ': 85,
          'Lực Đập': 70,
          'Libero': 95,
          'Bá Khí': 88, }, },
    ],
    total_price : '1,550 billion'

  },
   {
    id: 'planet-football',
    name: 'Thi Thi FC',
    subtitle: 'Khóm đá phủi 11A1',
    thumb: '/assets/photos/planet/football.png',
    mapBg: HOUSE_MAP_IMAGE,
    borderColor: 'border-amber-900',
    cats: [
      { id: 'f-1', name: 'Park Ji Tân', image: '/assets/catphoto/player_football/duytan.jpg', 
        meme: 'Ưu điểm : lên công - Nhược điểm : về thở.',value: '2M', stats: {
          'Tốc Độ': 92,
          'Bá Khí': 90,
          'Lực Sút': 70,
          'Thể Lực': 75,
          'Đánh Chặn': 86, }, },

      { id: 'f-2', name: 'Khánh Down', image: '/assets/catphoto/player_football/khanhhung.jpg', 
        meme: 'Chỉ số ẩn : Máu chiến , Dân Tây Nguyên , Tường chắn.',value: '11M', stats: {
          'Tốc Độ': 97,
          'Bá Khí': 95,
          'Lực Sút': 82,
          'Thể Lực': 95,
          'Đánh Chặn': 86, }, },

      { id: 'f-3', name: 'Hào Milk no Chill - Lợm em', image: '/assets/catphoto/player_football/quan-haomilk.jpg', 
        meme: 'Song Sát công thủ toàn diện , dễ chấn thương.',value: '477M', stats: {
          'Đột Phá': 87,
          'Bá Khí': 93,
          'Chuyền Chọt': 90,
          'Thể Lực': 95,
          'Ăn Mừng': 92, }, },

      { id: 'f-4', name: 'Gia Hào', image: '/assets/catphoto/player_football/giahao.jpg', 
        meme: 'Buffon của 11A1 , Chỉ số ấn : Bắt sút xa , Phát bổng , Bú l.' ,value: '573M', stats: {
          'Tốc Độ': 90,
          'Bá Khí': 85,
          'Bay Người': 99,
          'Thể Lực': 87,
          'Phản Xạ': 90, },},

      { id: 'f-5', name: 'Huy sợ ma lắm - Các què 17 - Thiện thầy cúng', image: '/assets/catphoto/player_football/cac-thien-huy.jpg', 
        meme: 'Tam sư 11A1 , Phối hợp và điều hòa trận ổn định , có bùa lỗ ban.' ,value: '713M', stats: {
          'Tốc Độ Phối Hợp': 89,
          'Bá Khí': 85,
          'Tiki Taka': 96,
          'Nhịp Độ': 87,
          'Dứt Điểm': 88, },},

      { id: 'f-6', name: 'Dâm La', image: '/assets/catphoto/player_football/lamgia.jpg', 
        meme: 'Siêu dự bị , đá ổn nhưng quen tay ki banh , Michael Jackson lai Bruney.' ,value: '14.5M', stats: {
          'Tốc Độ': 79,
          'Bá Khí': 85,
          'Lực Sút': 70,
          'Thể Lực': 95,
          'Đánh Chặn': 97, },},

      { id: 'f-7', name: 'Sang Lee', image: '/assets/catphoto/player_football/sangle.jpg', 
        meme: 'Siêu tiền vệ công , chạy chỗ cực tốt và khuấy đảo cánh , Đình Bắc của THPT LKA.',value: '175M', stats: {
          'Tốc Độ': 99,
          'Bá Khí': 85,
          'Lực Sút': 90,
          'Thể Lực': 95,
          'Đánh Chặn': 74, }, }
    ],
    total_price : '1965,5 billion'

  },
  {
    id: 'planet-4-group',
    name: 'Tổ 4',
    subtitle: 'Tổ 4 Gặp Là Sát',
    thumb: '/assets/photos/planet/to4.png',
    mapBg: HOUSE_MAP_IMAGE,
    borderColor: 'border-lime-300',
    cats: [
      { id: '4-1', name: 'Đại Ngọc', image: '', 
        meme: 'Tổ trưởng nhưng đéo có quyền hạn bằng tổ viên.',value: '2M', stats: {
          'Tốc Độ': 92,
          'Bá Khí': 90,
          'Lực Sút': 70,
          'Thể Lực': 75,
          'Đánh Chặn': 86, }, },

      { id: '4-2', name: 'Khoa Sì Ke', image: '/assets/photos/player_football/khanhhung.jpg', 
        meme: 'Bàn cuối lạnh teo dái , Siêu Xô Long Khánh.',value: '11M', stats: {
          'Tốc Độ': 97,
          'Bá Khí': 95,
          'Lực Sút': 82,
          'Thể Lực': 95,
          'Đánh Chặn': 86, }, },

      { id: '4-3', name: 'Kim Khánh - Cốt Minh Đợi', image: '/assets/photos/player_football/quan-haomilk.jpg', 
        meme: 'Vua Sinh Học cả khối 11 - Đéo sợ bố con thằng nào.',value: '477M', stats: {
          'Đột Phá': 87,
          'Bá Khí': 93,
          'Chuyền Chọt': 90,
          'Thể Lực': 95,
          'Ăn Mừng': 92, }, },

      { id: '4-4', name: 'Danni Bùi', image: '/assets/photos/player_football/giahao.jpg', 
        meme: 'Đụng là đụ - Đến là bú.' ,value: '573M', stats: {
          'Tốc Độ': 90,
          'Bá Khí': 85,
          'Bay Người': 99,
          'Thể Lực': 87,
          'Phản Xạ': 90, },},

      { id: '4-5', name: 'Huy sợ ma lắm', image: '/assets/photos/player_football/cac-thien-huy.jpg', 
        meme: 'Chuyên dụ dỗ Khánh Hưng đi ôn Lý , Văn Nghệ.' ,value: '713M', stats: {
          'Tốc Độ Phối Hợp': 89,
          'Bá Khí': 85,
          'Tiki Taka': 96,
          'Nhịp Độ': 87,
          'Dứt Điểm': 88, },},

      { id: '4-6', name: 'Hữu Khánh', image: '/assets/photos/player_football/lamgia.jpg', 
        meme: 'Body chuẩn nhất 11A1.' ,value: '14.5M', stats: {
          'Tốc Độ': 79,
          'Bá Khí': 85,
          'Lực Sút': 70,
          'Thể Lực': 95,
          'Đánh Chặn': 97, },},

      { id: '4-7', name: 'Khoa Pủm', image: '/assets/photos/player_football/sangle.jpg', 
        meme: 'Nhân chứng sống của sự tồn tại 11A1.',value: '175M', stats: {
          'Tốc Độ': 99,
          'Bá Khí': 85,
          'Lực Sút': 90,
          'Thể Lực': 95,
          'Đánh Chặn': 74, }, },
      { id: '4-8', name: 'Sang Long Thuận', image: '/assets/photos/player_football/sangle.jpg', 
        meme: 'Nhìn hiền chứ đụng là bị úp.',value: '175M', stats: {
          'Tốc Độ': 99,
          'Bá Khí': 85,
          'Lực Sút': 90,
          'Thể Lực': 95,
          'Đánh Chặn': 74, }, },
      { id: '4-9', name: 'Mẫn Liêm', image: '/assets/photos/player_football/sangle.jpg', 
        meme: 'Trai đẹp nhất nhì 11A1 với skill bóp chim bạn cùng bàn.',value: '175M', stats: {
          'Tốc Độ': 99,
          'Bá Khí': 85,
          'Lực Sút': 90,
          'Thể Lực': 95,
          'Đánh Chặn': 74, }, },
      { id: '4-10', name: 'Thiện củi', image: '/assets/photos/player_football/sangle.jpg', 
        meme: 'Đồ đệ đầu tiên và duy nhất của thầy Đợi.',value: '175M', stats: {
          'Tốc Độ': 99,
          'Bá Khí': 85,
          'Lực Sút': 90,
          'Thể Lực': 95,
          'Đánh Chặn': 74, }, },
      { id: '4-11', name: 'Trương Vĩnh Cốt', image: '/assets/photos/player_football/sangle.jpg', 
        meme: 'Bá khí aura farming nhất đất Long Khánh.',value: '175M', stats: {
          'Tốc Độ': 99,
          'Bá Khí': 85,
          'Lực Sút': 90,
          'Thể Lực': 95,
          'Đánh Chặn': 74, }, },
    ],
    total_price : '1965,5 billion'

  },
];
