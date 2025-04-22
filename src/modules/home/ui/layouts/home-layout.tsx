import HomeNavbar from "../components/home-navbar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="w-full">
      <HomeNavbar></HomeNavbar>
      <main>{children}</main>
    </div>
  );
};

export default HomeLayout;
