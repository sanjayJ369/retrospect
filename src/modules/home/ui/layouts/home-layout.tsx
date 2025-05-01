import HomeNavbar from "../components/home-navbar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <HomeNavbar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default HomeLayout;
