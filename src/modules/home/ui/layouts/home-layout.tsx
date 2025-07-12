import HomeNavbar from "../components/home-navbar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="w-full h-screen flex flex-col">
      <HomeNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default HomeLayout;
