import { useEffect, useMemo, useState } from "react";
import {
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import { api, uploadImage } from "./api.js";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Compass,
  Eye,
  EyeOff,
  Filter,
  Library,
  LoaderCircle,
  LogOut,
  Menu,
  PackageCheck,
  Search,
  Shield,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const CATEGORIES = [
  "Fiction",
  "Literary Fiction",
  "Fantasy",
  "Mystery",
  "Sci-Fi",
  "Romance",
  "History",
  "Academic",
  "Biography",
  "Children",
];
const coverFallback =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80";
const money = (n) => `$${Number(n || 0).toFixed(2)}`;
const errorText = (e) => e.userMessage || e.message || "Something went wrong.";
const inlineUtilities = {
  status: {
    delivered: "[background:#e2ece1] [color:#3e704d]",
    published: "[background:#e2ece1] [color:#3e704d]",
    approved: "[background:#e2ece1] [color:#3e704d]",
    user: "[background:#e2ece1] [color:#3e704d]",
    pending: "[background:#f3e9d7] [color:#92713c]",
    "pending-approval": "[background:#f3e9d7] [color:#92713c]",
    dispatched: "[background:#e5e9f0] [color:#62728c]",
    librarian: "[background:#e5e9f0] [color:#62728c]",
    unpublished: "[background:#f0e5e0] [color:#a36750]",
    admin: "[background:#f0e5e0] [color:#a36750]",
    checked_out: "[background:#f0e5e0] [color:#a36750]",
  },
  tones: {
    sage: "[background:linear-gradient(145deg,_#e0fff6,_#c9f3e7)] [color:#267963]",
    lavender: "[background:#ece9ff] [color:#6d5ce3]",
    sand: "[background:#fff3d2] [color:#ba8a25]",
    rose: "[background:linear-gradient(145deg,_#fff0f3,_#ffd8e1)] [color:#bc536f]",
    blue: "[background:linear-gradient(145deg,_#e8f5ff,_#cee8ff)] [color:#367fb9]",
    mint: "[background:#ddfbf1] [color:#1a9e82]",
    peach: "[background:#ffe8ee] [color:#dc5d7c]",
  },
};

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null),
    [authLoading, setAuthLoading] = useState(true),
    [menu, setMenu] = useState(false),
    [cart, setCart] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem("bd-cart") || "[]");
      } catch {
        return [];
      }
    });
  useEffect(() => {
    localStorage.setItem("bd-cart", JSON.stringify(cart));
  }, [cart]);
  const addToCart = (book) => {
    setCart((items) =>
      items.some((item) => item._id === book._id) ? items : [...items, book],
    );
    toast.success("Added to your cart.");
  };
  useEffect(() => {
    api
      .get("/auth/me")
      .then((r) => setUser(r.data.user))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      toast.success("You are signed out.");
    } catch (e) {
      toast.error(errorText(e));
    }
  };
  return (
    <>
      <header className="sticky top-0 z-40 h-[78px] border-b border-[#e8e8f4] bg-white/90 shadow-[0_8px_28px_rgba(58,53,113,.07)] backdrop-blur-lg max-[760px]:h-[70px]">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-[42px] max-[1000px]:px-7 max-[760px]:px-5 max-[960px]:relative">
          <Link
            className="inline-flex items-center gap-3 font-display text-[23px] font-black leading-none tracking-[-.035em] text-[#302d61] max-[760px]:text-[21px] max-[390px]:text-[19px]"
            to="/"
          >
            <span className="grid h-[42px] w-[42px] place-items-center rounded-[15px_15px_15px_6px] bg-gradient-to-br from-[#8677ff] to-[#5b4be8] text-[#faf7ef] shadow-[0_7px_16px_rgba(91,75,232,.27)] max-[760px]:h-[35px] max-[760px]:w-[35px] max-[390px]:h-8 max-[390px]:w-8">
              <BookOpen size={21} />
            </span>
            <span>
              Biblio<span className="[color:#ff7c9b]">Drop</span>
              <small className="mt-1 block font-sans text-[9px] font-bold tracking-[.19em] text-[#8888ad]">BOOKS, BROUGHT CLOSER</small>
            </span>
          </Link>
          <button
            className="hidden h-12 w-12 place-items-center rounded-2xl border-0 bg-[#f0edff] p-2 text-[#5b4be8] max-[960px]:grid"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle navigation"
          >
            {menu ? <X /> : <Menu />}
          </button>
          <nav
            className={`flex items-center gap-2.5 whitespace-nowrap text-[13px] font-bold text-[#676989] ${menu ? "max-[960px]:flex" : "max-[960px]:hidden"} max-[960px]:absolute max-[960px]:right-[22px] max-[960px]:top-[calc(100%+10px)] max-[960px]:z-50 max-[960px]:min-w-[min(340px,calc(100vw-32px))] max-[960px]:flex-col max-[960px]:items-stretch max-[960px]:gap-1 max-[960px]:rounded-[22px] max-[960px]:border max-[960px]:border-[#eeedfa] max-[960px]:bg-white/95 max-[960px]:p-3.5 max-[960px]:shadow-[0_18px_38px_rgba(58,53,113,.16)] max-[960px]:backdrop-blur-lg`}
          >
            <NavLink end to="/" className={({ isActive }) => `rounded-full px-4 py-3 transition-colors hover:bg-[#f0edff] hover:text-[#5b4be8] max-[960px]:rounded-xl max-[960px]:px-3 ${isActive ? "bg-[#f0edff] text-[#5b4be8]" : ""}`} onClick={() => setMenu(false)}>
              Home
            </NavLink>
            <NavLink to="/books" className={({ isActive }) => `rounded-full px-4 py-3 transition-colors hover:bg-[#f0edff] hover:text-[#5b4be8] max-[960px]:rounded-xl max-[960px]:px-3 ${isActive ? "bg-[#f0edff] text-[#5b4be8]" : ""}`} onClick={() => setMenu(false)}>
              Browse books
            </NavLink>
            {user && (user.role === "user" || user.role === "librarian") && (
              <Link
                className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-[12px] text-[#222344] transition-colors hover:bg-[#f0edff] hover:text-[#5b4be8] max-[960px]:rounded-xl max-[960px]:px-3"
                to="/cart"
                onClick={() => setMenu(false)}
              >
                <PackageCheck size={17} /> Cart <b>{cart.length}</b>
              </Link>
            )}
            {user && (
              <Link
                className="grid h-[42px] w-[42px] shrink-0 self-center place-items-center overflow-hidden rounded-full bg-transparent p-0 max-[960px]:my-2"
                to={`/dashboard/${user.role}?tab=profile`}
                onClick={() => setMenu(false)}
              >
                {user.avatar ? (
                  <img className="h-full w-full rounded-full object-cover" src={user.avatar} alt="Profile" />
                ) : (
                  <span className="grid h-full w-full place-items-center rounded-full bg-[#7868f4] font-bold text-white">{user.name?.[0]?.toUpperCase()}</span>
                )}
              </Link>
            )}
            {user && (
              <NavLink
                to={`/dashboard/${user.role}`}
                className={({ isActive }) => `rounded-full px-4 py-3 transition-colors hover:bg-[#f0edff] hover:text-[#5b4be8] max-[960px]:rounded-xl max-[960px]:px-3 ${isActive ? "bg-[#f0edff] text-[#5b4be8]" : ""}`}
                onClick={() => setMenu(false)}
              >
                {user.role === "librarian" ? "Librarian account" : "Dashboard"}
              </NavLink>
            )}
            {!user && (
              <NavLink to="/login" className="rounded-full px-4 py-3 transition-colors hover:bg-[#f0edff] hover:text-[#5b4be8] max-[960px]:rounded-xl max-[960px]:px-3" onClick={() => setMenu(false)}>
                Log in
              </NavLink>
            )}
            {user ? (
              <button
                className="inline-flex items-center gap-2 rounded-full border-0 bg-transparent px-4 py-3 text-[13px] text-[#59645c] transition-colors hover:bg-[#efedff] hover:text-[#5143d2] max-[960px]:rounded-xl max-[960px]:px-3"
                onClick={logout}
              >
                <LogOut size={15} /> Sign out
              </button>
            ) : (
              <Link
                className="[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)] [min-height:41px] [padding:0_15px] [font-size:11px] max-[760px]:[margin-top:13px]"
                to="/register"
              >
                Join BiblioDrop <ArrowRight size={16} />
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/books"
              element={<Browse onAddToCart={user ? addToCart : undefined} />}
            />
            <Route
              path="/books/:id"
              element={
                <BookDetail
                  user={user}
                  onAddToCart={user ? addToCart : undefined}
                />
              }
            />
            <Route
              path="/cart"
              element={
                authLoading ? (
                  <div className="flex min-h-[440px] items-center justify-center gap-3 text-sm text-[#777993]">
                    <LoaderCircle className="animate-spin text-[#6b5ce7]" />
                    Loading your library…
                  </div>
                ) : user ? (
                  <CartPage cart={cart} setCart={setCart} user={user} />
                ) : (
                  <Navigate
                    to={`/login?return=${encodeURIComponent("/cart")}`}
                    replace
                  />
                )
              }
            />
            <Route
              path="/payment/cancel"
              element={<PaymentCancel user={user} />}
            />
            <Route
              path="/login"
              element={<AuthPage mode="login" setUser={setUser} />}
            />
            <Route
              path="/register"
              element={<AuthPage mode="register" setUser={setUser} />}
            />
            <Route
              path="/verify-email"
              element={<VerifyEmail setUser={setUser} />}
            />
            <Route
              path="/forgot-password"
              element={<PasswordPage mode="forgot" />}
            />
            <Route
              path="/reset-password"
              element={<PasswordPage mode="reset" />}
            />
            <Route
              path="/payment/success"
              element={<PaymentSuccess user={user} setCart={setCart} />}
            />
            <Route
              path="/dashboard/:role"
              element={
                authLoading ? (
                  <div className="flex min-h-[440px] items-center justify-center gap-3 text-sm text-[#777993]">
                    <LoaderCircle className="animate-spin text-[#6b5ce7]" /> Loading your library…
                  </div>
                ) : (
                  <Dashboard user={user} setUser={setUser} />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </main>
      <Footer dashboard={location.pathname.startsWith("/dashboard/")} />
    </>
  );
}
function Home() {
  const [books, setBooks] = useState([]),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/books/featured")
      .then((r) => setBooks(r.data))
      .catch((e) => toast.error(errorText(e)))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <section className="relative mx-auto grid min-h-[620px] w-full max-w-[1440px] grid-cols-[52%_48%] overflow-hidden rounded-b-[42px] bg-gradient-to-br from-[#5749d6] via-[#7a68f3] to-[#a294ff] shadow-[0_24px_55px_rgba(86,72,209,.2)] max-[1000px]:grid-cols-[53%_47%] max-[760px]:flex max-[760px]:min-h-0 max-[760px]:flex-col max-[760px]:rounded-b-[30px]">
        <div className="[position:absolute] [inset:0_48%_0_0] [background:radial-gradient(_circle_at_14%_18%,_rgb(255_255_255_/_10%)_0_130px,_transparent_131px_),_linear-gradient(130deg,_#5142ce,_#7565ec_75%,_#8274f2)] max-[760px]:[inset:0_0_39%]"></div>
        <div className="[position:relative] [z-index:1] [color:#f6f4ea] [padding:94px_5vw_75px_max(7vw,_64px)] [max-width:700px] max-[1000px]:[padding-left:6vw] max-[760px]:[padding:65px_27px_44px]">
          <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px] [color:#c4d0bc]">
            <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]"></span>{" "}
            YOUR NEIGHBORHOOD, IN EVERY CHAPTER
          </div>
          <h1 className="mb-5 font-display text-[clamp(42px,5.2vw,72px)] font-black leading-[1.02] tracking-[-.055em] text-white max-[760px]:text-[46px]">
            Your local library,
            <br />
            <em className="font-serif font-medium text-[#ffd5e0]">delivered.</em>
          </h1>
          <p className="max-w-[480px] text-[15px] leading-7 text-white/80 max-[760px]:text-sm">
            Find the stories that stay with you. Borrow from independent
            libraries and book lovers in your community, then have your next
            favorite brought right to your door.
          </p>
          <div className="[display:flex] [align-items:center] [gap:23px]">
            <Link
              className="[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:#f8f5ed] [color:#5b4be8]"
              to="/books"
            >
              Find your next read <ArrowRight size={17} />
            </Link>
            <a
              className={`${"[display:inline-flex] [align-items:center] [gap:8px] [color:#5b4be8] [font-weight:700] [font-size:12px] [background:none] [border:0] [padding:0_5px_11px] max-[760px]:[align-self:flex-start] max-[760px]:[padding:5px] [color:#ecede4]"}`}
              href="#how-it-works"
            >
              How it works <ArrowDown size={15} />
            </a>
          </div>
          <div className="[display:flex] [align-items:center] [gap:13px] [margin-top:55px] [color:#d4dfd3] [font-size:10px] [line-height:1.55] max-[760px]:[margin-top:35px]">
            <div className="[display:flex] [padding-left:4px]">
              <i>R</i>
              <i>M</i>
              <i>A</i>
              <i>+</i>
            </div>
            <span>
              Loved by curious readers
              <br />
              <b>in your neighborhood</b>
            </span>
          </div>
        </div>
        <div className="relative min-h-[620px] min-w-0 overflow-hidden rounded-l-[36px] max-[760px]:min-h-[350px] max-[760px]:rounded-t-[30px] max-[760px]:rounded-b-none">
          <img
            className="absolute h-full w-full object-cover object-[center_48%] saturate-90"
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1300&q=88"
          />
          <div className="[position:absolute] [inset:0] [background:linear-gradient(90deg,_rgba(36,_76,_59,_0.42),_transparent_43%),_linear-gradient(0deg,_rgba(18,_30,_23,_0.25),_transparent_60%)]"></div>
          <div className="[position:absolute] [bottom:62px] [left:35px] [display:flex] [align-items:center] [gap:12px] [padding:14px_19px] [background:#f8f5ed] [box-shadow:0_18px_42px_rgb(31_26_91_/_23%)] [border-radius:22px] [color:#222344] max-[760px]:[bottom:32px] max-[760px]:[left:20px]">
            <span className="[width:35px] [height:35px] [display:grid] [place-items:center] [background:#e7e4ff] [color:#5b4be8] [border-radius:15px]">
              <Sparkles size={17} />
            </span>
            <span>
              <b>A little library magic</b>
              <small>Good stories find their way.</small>
            </span>
          </div>
          <div className="[position:absolute] [right:20px] [top:50%] [writing-mode:vertical-rl] [letter-spacing:2.3px] [font-size:8px] [color:white] [opacity:0.85] max-[760px]:[right:12px]">
            A NEW WAY TO GET LOST IN A BOOK
          </div>
        </div>
        <div className="absolute bottom-5 left-[7vw] text-[8px] tracking-[1.3px] text-white/65 max-[760px]:bottom-[13px] max-[760px]:left-[25px] max-[760px]:text-[7px]">
          VOL. 01 &nbsp; / &nbsp; THE JOY OF READING
        </div>
      </section>
      <section className="[max-width:1320px] [margin:auto] [padding:30px_7.5%] [min-height:122px] [display:flex] [align-items:center] [gap:40px] [background:linear-gradient(120deg,_#fff,_#fff8fb_55%,_#f1fffb)] [margin-top:24px] [border:1px_solid_#efedff] [border-radius:28px] [box-shadow:0_12px_32px_rgb(74_69_139_/_7%)] max-[760px]:[padding:22px_22px] max-[760px]:[gap:13px] max-[760px]:[justify-content:space-between] max-[760px]:[flex-wrap:wrap] max-[390px]:[gap:8px]">
        <div>
          <strong>01</strong>
          <span>
            Local libraries,
            <br />
            within reach
          </span>
        </div>
        <i></i>
        <div>
          <strong>02</strong>
          <span>
            Thoughtful delivery,
            <br />
            right to your door
          </span>
        </div>
        <i></i>
        <div>
          <strong>03</strong>
          <span>
            Real readers,
            <br />
            honest reviews
          </span>
        </div>
        <div
          className={`${"[margin-left:auto] [display:flex] [gap:12px] [align-items:center] [text-align:right] [font:italic_15px/1.35_Trebuchet_MS,_ui-rounded,_system-ui,_sans-serif] [color:#5b4be8] max-[760px]:[display:none]"}`}
        >
          A more personal
          <br />
          way to find a story. <ArrowRight size={19} />
        </div>
      </section>
      <section className="[max-width:1440px] [margin:auto] [padding:100px_7.5%] max-[1000px]:[padding-left:6%] max-[1000px]:[padding-right:6%] max-[760px]:[padding:66px_23px]">
        <SectionHeading
          kicker="THE SHELF, RIGHT NOW"
          title="Stories worth staying in for."
          copy="Fresh finds from the independent shelves around you."
          action={
            <Link
              className="[display:inline-flex] [align-items:center] [gap:8px] [color:#5b4be8] [font-weight:700] [font-size:12px] [background:none] [border:0] [padding:0_5px_11px] max-[760px]:[align-self:flex-start] max-[760px]:[padding:5px]"
              to="/books"
            >
              Explore every book <ArrowRight size={16} />
            </Link>
          }
        />
        {loading ? (
          <div className="[display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:28px_22px] max-[760px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[760px]:[gap:24px_13px]">
            {[1, 2, 3, 4].map((n) => (
              <div className="[min-width:0]" key={n}>
                <div className="[height:290px] [background:linear-gradient(90deg,_#ece9e1,_#f0eee8,_#ece9e1)] [background-size:200%] animate-pulse max-[1000px]:[height:250px] max-[760px]:[height:245px] max-[390px]:[height:215px]" />
                <div className="[height:11px] [width:80%] [background:#e7e4dc] [margin-top:15px]" />
                <div className="[height:11px] [width:80%] [background:#e7e4dc] [margin-top:15px] [width:48%] [margin-top:8px]" />
              </div>
            ))}
          </div>
        ) : books.length ? (
          <div className="[display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:28px_22px] max-[760px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[760px]:[gap:24px_13px]">
            {books.map((b, i) => (
              <BookCard key={b._id} book={b} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your next favorite is almost here"
            copy="Browse the community shelves for a good story."
            action={
              <Link
                className="[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)]"
                to="/books"
              >
                Browse books
              </Link>
            }
          />
        )}
      </section>
      <section
        id="how-it-works"
        className="[max-width:1440px] [margin:auto] [padding:40px_7.5%_100px] [display:grid] [grid-template-columns:1fr_1fr] [gap:9%] [align-items:center] max-[1000px]:[padding-left:6%] max-[1000px]:[padding-right:6%] max-[1000px]:[gap:6%] max-[760px]:[display:flex] max-[760px]:[flex-direction:column] max-[760px]:[padding:0_23px_65px] max-[760px]:[gap:36px]"
      >
        <div className="[position:relative] [height:530px] max-[1000px]:[height:470px] max-[760px]:[width:calc(100%_-_12px)] max-[760px]:[height:370px] max-[760px]:[margin-right:12px]">
          <img className="h-full w-full rounded-[34px] object-cover shadow-[0_24px_60px_rgba(34,35,68,.15)]" src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1000&q=85" alt="A quiet reading moment" />
          <div className="[position:absolute] [right:-22px] [bottom:24px] [width:90px] [height:90px] [border:1px_solid_#f8f5ef] [outline:5px_solid_#244c3b] [display:grid] [place-content:center] [text-align:center] [background:#5b4be8] [color:#f8f5ef] [font:600_13px/1.35_Trebuchet_MS,_ui-rounded,_system-ui,_sans-serif] [letter-spacing:1px] [transform:rotate(7deg)] max-[760px]:[right:-12px] max-[760px]:[width:77px] max-[760px]:[height:77px]">
            READ
            <br />
            LOCAL
          </div>
        </div>
        <div className="[padding:20px_0] max-[760px]:[width:100%]">
          <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
            <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]"></span>{" "}
            A GOOD STORY, MADE SIMPLE
          </div>
          <h2 className="mb-3 font-display text-[clamp(30px,3.4vw,46px)] font-black leading-[1.08] tracking-[-.045em] text-[#222344]">
            Three small steps.
            <br />
            <em className="font-serif font-medium text-[#6b5ce7]">One big escape.</em>
          </h2>
          <div className="[margin-bottom:28px]">
            <Step
              num="01"
              icon={<Compass />}
              title="Find a book"
              text="Explore curated shelves from independent librarians and readers near you."
            />
            <Step
              num="02"
              icon={<Truck />}
              title="Make it yours"
              text="Request doorstep delivery with a simple, secure delivery-fee checkout."
            />
            <Step
              num="03"
              icon={<BookOpen />}
              title="Turn the page"
              text="Enjoy your read, then share a review once your book has arrived."
            />
          </div>
          <Link
            to="/books"
            className="[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)]"
          >
            Start exploring <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="[display:grid] [grid-template-columns:1fr_1fr] [background:linear-gradient(130deg,_#493bbf,_#6859e7)] [color:#f4f1e8] [min-height:410px] [overflow:hidden] [border-radius:38px] max-[760px]:[grid-template-columns:1fr] max-[760px]:[border-radius:28px]">
        <div className="[padding:72px_11%_65px_max(9vw,_65px)] [align-self:center] max-[760px]:[padding:55px_25px]">
          <span className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px] [color:#c4d0bc]">
            <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]"></span>{" "}
            FOR INDEPENDENT BOOK PEOPLE
          </span>
          <h2 className="mb-3 font-display text-[clamp(30px,3.4vw,46px)] font-black leading-[1.08] tracking-[-.045em] text-white">
            Your shelves have
            <br />a story to tell.
          </h2>
          <p className="text-[13px] leading-6 text-[#74758f]">
            Share the books you love with readers who will love them next.
            BiblioDrop helps your little library find a much bigger
            neighborhood.
          </p>
          <Link
            className="[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:#f8f5ed] [color:#5b4be8]"
            to="/register"
          >
            Become a librarian <ArrowRight size={16} />
          </Link>
        </div>
        <div className="[position:relative] [min-height:410px] [overflow:hidden] [border-radius:45%_0_0_45%_/_55%_0_0_55%] max-[760px]:[min-height:300px] max-[760px]:[border-radius:30px_30px_0_0]">
          <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1000&q=85" alt="Reader browsing a book" />
          <div className="[position:absolute] [bottom:26px] [right:30px] [background:#f7f5ef] [color:#5b4be8] [padding:14px_17px] [font:600_11px/1.4_Trebuchet_MS,_ui-rounded,_system-ui,_sans-serif] [letter-spacing:1px] [border-radius:18px] [box-shadow:0_12px_30px_rgb(31_26_91_/_20%)]">
            INDEPENDENT
            <br />
            BY NATURE
          </div>
        </div>
      </section>
      <section className="[max-width:1440px] [margin:auto] [padding:100px_7.5%] max-[1000px]:[padding-left:6%] max-[1000px]:[padding-right:6%] max-[760px]:[padding:66px_23px] [padding-top:87px] [padding-bottom:95px] max-[760px]:[padding-top:62px]">
        <SectionHeading
          kicker="FOLLOW A FEELING"
          title="What are you in the mood for?"
          copy="Start with a genre. Let the story take it from there."
        />
        <div className="[display:grid] [grid-template-columns:repeat(5,_1fr)] [gap:14px] max-[760px]:[grid-template-columns:repeat(2,_1fr)] max-[760px]:[gap:10px]">
          {[
            {
              name: "Fiction",
              icon: "✳",
              tone: "sage",
            },
            {
              name: "Sci-Fi",
              icon: "☾",
              tone: "lavender",
            },
            {
              name: "Academic",
              icon: "⌘",
              tone: "sand",
            },
            {
              name: "Mystery",
              icon: "◉",
              tone: "rose",
            },
            {
              name: "Fantasy",
              icon: "✧",
              tone: "blue",
            },
          ].map((c) => (
            <Link
              className={`[height:145px] [padding:18px] [display:flex] [flex-direction:column] [align-items:flex-start] [justify-content:space-between] [border-radius:26px] [transition:transform_0.2s] [position:relative] [overflow:hidden] [border:1px_solid_rgb(255_255_255_/_80%)] [box-shadow:0_10px_24px_rgb(64_55_128_/_8%)] hover:[transform:translateY(-4px)] max-[760px]:[height:118px] max-[760px]:[padding:14px]${inlineUtilities.tones[c.tone] || ""}`}
              to={`/books?category=${encodeURIComponent(c.name)}`}
              key={c.name}
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/70 text-xl shadow-sm">{c.icon}</span>
              <b className="text-lg font-extrabold tracking-tight">{c.name}</b>
              <ArrowRight size={17} />
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto my-10 flex w-[92%] max-w-[1320px] items-center justify-between gap-10 rounded-[32px] border border-white/80 bg-gradient-to-br from-[#eeeaff] via-[#ffe5ed] to-[#dcf8f0] px-[7%] py-14 shadow-[0_18px_45px_rgba(91,75,232,.09)] max-[760px]:my-7 max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-7 max-[760px]:rounded-[26px] max-[760px]:px-6 max-[760px]:py-9">
        <div className="max-w-[500px]">
          <span className="mb-3 flex items-center gap-2 text-[10px] font-extrabold tracking-[.18em] text-[#6f67b5]">
            <span className="h-2 w-2 rounded-full bg-[#ff718d]"></span> A NOTE FROM THE BOOKSHELF
          </span>
          <h2 className="font-display text-[clamp(30px,3.4vw,46px)] font-black leading-[1.08] tracking-[-.045em] text-[#29294f]">
            Stories worth
            <br />
            <em className="font-serif font-medium text-[#6555d9]">opening your inbox for.</em>
          </h2>
        </div>
        <form
          className="w-full max-w-[480px]"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("You’re on the list. See you in your inbox!");
            e.currentTarget.reset();
          }}
        >
          <label className="text-sm font-semibold leading-6 text-[#4c4c70]" htmlFor="newsletter-email">
            A little literary inspiration, every so often.
          </label>
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/90 bg-white/80 p-1.5 shadow-sm backdrop-blur">
            <input
              id="newsletter-email"
              required
              type="email"
              placeholder="Your email address"
              className="min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 py-3 text-sm text-[#29294f] outline-none placeholder:text-[#9a9bb0] focus:ring-0"
            />
            <button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#7868f4] to-[#5747df] text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg" aria-label="Subscribe" type="submit">
              <ArrowRight size={20} />
            </button>
          </div>
          <small className="mt-2 block text-xs text-[#74758f]">Just good reads. No clutter.</small>
        </form>
      </section>
    </>
  );
}
function SectionHeading({ kicker, title, copy, action }) {
  return (
    <div className="[display:flex] [align-items:flex-end] [justify-content:space-between] [gap:24px] [margin-bottom:35px] max-[760px]:[align-items:flex-start] max-[760px]:[flex-direction:column] max-[760px]:[margin-bottom:25px] max-[760px]:[gap:10px]">
      <div>
        <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
          <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />
          {kicker}
        </div>
        <h2 className="max-w-[760px] font-display text-[clamp(30px,3.4vw,46px)] font-black leading-[1.08] tracking-[-.045em] text-[#222344]">{title}</h2>
        {copy && <p className="mt-3 max-w-[620px] text-sm leading-6 text-[#777993]">{copy}</p>}
      </div>
      {action && <div className="[padding-bottom:5px]">{action}</div>}
    </div>
  );
}
function Step({ num, icon, title, text }) {
  return (
    <div className="[display:grid] [grid-template-columns:28px_38px_1fr] [gap:12px] [align-items:start] [padding:17px_0] [border-top:1px_solid_#e8e8f4]">
      <span className="[font-size:9px] [letter-spacing:0.5px] [color:#9ba197] [padding-top:7px]">
        {num}
      </span>
      <span className="[width:35px] [height:35px] [display:grid] [place-items:center] [background:#e7e4ff] [border-radius:15px] [color:#5b4be8]">
        {icon}
      </span>
      <div>
        <h3 className="font-display text-base font-extrabold text-[#29294f]">{title}</h3>
        <p className="mt-1 text-[13px] leading-6 text-[#777993]">{text}</p>
      </div>
    </div>
  );
}
function BookCard({ book, index = 0, onAddToCart }) {
  return (
    <motion.article
      className="[min-width:0] [padding:12px] [border:1px_solid_#eeedfa] [border-radius:25px] [background:rgb(255_255_255_/_88%)] [box-shadow:0_11px_30px_rgb(58_53_113_/_7%)] [transition:transform_0.22s_ease,_box-shadow_0.22s_ease] hover:[transform:translateY(-6px)] hover:[box-shadow:0_18px_35px_rgb(58_53_113_/_13%)]"
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.04,
      }}
    >
      <Link
        className="[position:relative] [display:block] [height:290px] [background:#f0edff] [overflow:hidden] [border-radius:19px] max-[1000px]:[height:250px] max-[760px]:[height:245px] max-[390px]:[height:215px]"
        to={`/books/${book._id}`}
      >
        <img
          className="h-full w-full rounded-[19px] object-cover transition-transform duration-500 hover:scale-[1.03]"
          src={book.coverUrl || coverFallback}
          alt={`Cover of ${book.title}`}
          onError={(e) => (e.currentTarget.src = coverFallback)}
        />
        <span
          className={
            book.availability === ""
              ? "[position:absolute] [left:10px] [top:10px] [padding:6px_9px] [background:#e5fff7] [color:#168c75] [font-size:8px] [font-weight:700] [letter-spacing:0.6px] [text-transform:uppercase] [border-radius:999px]"
              : "[position:absolute] [left:10px] [top:10px] [padding:6px_9px] [background:#e5fff7] [color:#168c75] [font-size:8px] [font-weight:700] [letter-spacing:0.6px] [text-transform:uppercase] [border-radius:999px] [color:#d4506d] [background:#fff0f3]"
          }
        >
          {book.availability === "available" ? "Available" : "On loan"}
        </span>
      </Link>
      <div className="[display:flex] [justify-content:space-between] [gap:5px] [margin:14px_0_8px] [color:#8b9087] [font-size:9px] max-[760px]:[font-size:8px] max-[390px]:[flex-direction:column] max-[390px]:[gap:4px]">
        <span>{book.category}</span>
        <span>{money(book.deliveryFee)} delivery</span>
      </div>
      <Link
        className="[font:600_17px/1.35_Trebuchet_MS,_ui-rounded,_system-ui,_sans-serif] [display:block] [font-family:Trebuchet_MS,_ui-rounded,_system-ui,_sans-serif] [letter-spacing:-0.035em] max-[760px]:[font-size:15px]"
        to={`/books/${book._id}`}
      >
        {book.title}
      </Link>
      <p
        className={`${"[font-size:10px] [color:#828981] [margin:4px_0_13px]"}`}
      >
        by {book.author}
      </p>
      <div className="[border-top:1px_solid_#e8e8f4] [padding-top:10px] [display:flex] [justify-content:space-between] [align-items:center] [color:#81877e] [font-size:9px] max-[760px]:[font-size:8px]">
        <span>
          <Library size={14} />
          {book.owner?.name || "Community library"}
        </span>
        <Link to={`/books/${book._id}`} aria-label={`View ${book.title}`}>
          <ArrowRight size={17} />
        </Link>
      </div>
      {onAddToCart && (
        <button
          className={`${"[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:#fff] [border-color:#c8cec6] [color:#5545de] [border:1px_solid_#dcd9ff] [width:100%] [justify-content:center] [margin-top:12px] [padding:10px] [font-size:10px]"}`}
          disabled={book.availability !== "available"}
          onClick={() => onAddToCart(book)}
        >
          {book.availability === "available" ? "Add to cart" : "Unavailable"}{" "}
          <ArrowRight size={14} />
        </button>
      )}
    </motion.article>
  );
}
function Browse({ onAddToCart }) {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({
      items: [],
      page: 1,
      pages: 0,
      total: 0,
    }),
    [loading, setLoading] = useState(true),
    [query, setQuery] = useState(params.get("q") || ""),
    [filterOpen, setFilterOpen] = useState(false);
  const queryString = params.toString();
  useEffect(() => {
    setLoading(true);
    api
      .get(`/books${queryString ? `?${queryString}` : ""}`)
      .then((r) => setData(r.data))
      .catch((e) => toast.error(errorText(e)))
      .finally(() => setLoading(false));
  }, [queryString]);
  const update = (key, value) => {
    const p = new URLSearchParams(params);
    value ? p.set(key, value) : p.delete(key);
    if (key !== "page") p.delete("page");
    setParams(p);
  };
  const submitSearch = (e) => {
    e.preventDefault();
    update("q", query.trim());
  };
  return (
    <div className="mx-auto w-full max-w-[1280px] px-8 py-14 max-[760px]:px-5 max-[760px]:py-9">
      <div className="[margin-bottom:35px]">
        <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
          <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />{" "}
          THE COMMUNITY BOOKSHELF
        </div>
        <h1 className="font-display text-[clamp(30px,3.4vw,44px)] font-black leading-tight tracking-[-.045em] text-[#222344]">
          Find a story
          <br />
          <em>that feels like yours.</em>
        </h1>
        <p className="text-[13px] leading-6 text-[#74758f]">
          Browse the shelves of independent libraries and readers around you.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-[#e8e8f4] py-5">
        <form
          className="flex h-[50px] min-w-[260px] max-w-[650px] flex-1 items-center gap-3 rounded-2xl border border-[#e4e3f0] bg-white px-4 text-[#81839c] shadow-[0_6px_20px_rgba(58,53,113,.04)] transition focus-within:border-[#7868f4] focus-within:ring-4 focus-within:ring-[#7868f4]/10 max-[760px]:max-w-none"
          onSubmit={submitSearch}
        >
          <Search className="shrink-0" size={19} />
          <input
            className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-[#29294f] outline-none ring-0 placeholder:text-[#a0a1b6] focus:border-0 focus:outline-none focus:ring-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or author"
          />
          <button className="shrink-0 rounded-xl bg-gradient-to-r from-[#7868f4] to-[#5b4be8] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" type="submit">Search</button>
        </form>
        <button
          className="inline-flex h-[50px] shrink-0 items-center justify-center gap-2.5 rounded-full border border-[#e7e4fb] bg-white px-5 text-sm font-extrabold text-[#5b4be8] shadow-[0_8px_24px_rgba(91,75,232,.1)] transition hover:-translate-y-0.5 hover:shadow-md max-[760px]:flex-1"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <Filter size={16} /> Filters{" "}
          {filterOpen ? <X size={15} /> : <ChevronDown size={15} />}
        </button>
        <label className="ml-auto flex items-center gap-2 text-xs font-semibold text-[#85869f] max-[760px]:ml-0 max-[760px]:flex-1 max-[760px]:justify-end">
          <span>Sort</span>
          <select
            className="min-w-[150px] rounded-xl border border-[#e4e3f0] bg-white px-3 py-2.5 text-xs font-semibold text-[#4c4d6b] outline-none focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
            value={params.get("sort") || "newest"}
            onChange={(e) => update("sort", e.target.value)}
          >
            <option value="newest">Recently added</option>
            <option value="oldest">Oldest first</option>
            <option value="fee-low">Delivery fee: low to high</option>
            <option value="fee-high">Delivery fee: high to low</option>
          </select>
        </label>
      </div>
      {filterOpen && (
        <div className="my-2 flex flex-wrap items-end gap-4 rounded-2xl border border-[#e8e6f5] bg-white p-5 shadow-sm max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-3">
          <label className="flex min-w-[180px] flex-1 flex-col gap-2 text-xs font-bold text-[#656681]">
            Category
            <select className="w-full rounded-xl border border-[#e4e3f0] bg-[#fcfcff] px-3 py-3 text-sm font-medium text-[#4c4d6b] outline-none focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
              value={params.get("category") || ""}
              onChange={(e) => update("category", e.target.value)}
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex min-w-[180px] flex-1 flex-col gap-2 text-xs font-bold text-[#656681]">
            Availability
            <select className="w-full rounded-xl border border-[#e4e3f0] bg-[#fcfcff] px-3 py-3 text-sm font-medium text-[#4c4d6b] outline-none focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
              value={params.get("availability") || ""}
              onChange={(e) => update("availability", e.target.value)}
            >
              <option value="">All books</option>
              <option value="available">Available</option>
              <option value="checked_out">On loan</option>
            </select>
          </label>
          <label className="flex min-w-[150px] flex-1 flex-col gap-2 text-xs font-bold text-[#656681]">
            Max delivery fee
            <input className="w-full rounded-xl border border-[#e4e3f0] bg-[#fcfcff] px-3 py-3 text-sm font-medium text-[#4c4d6b] outline-none focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
              type="number"
              min="0"
              value={params.get("maxFee") || ""}
              onChange={(e) => update("maxFee", e.target.value)}
              placeholder="Any"
            />
          </label>
          <button
            className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-xs font-bold text-[#5b4be8] transition hover:bg-[#f1efff]"
            onClick={() => {
              setParams({});
              setQuery("");
            }}
          >
            Clear filters <X size={14} />
          </button>
        </div>
      )}
      <div className="[font-size:10px] [color:#8b9188] [margin:15px_0_20px]">
        {loading ? (
          "Gathering the shelves…"
        ) : (
          <>
            {data.total} {data.total === 1 ? "book" : "books"} to explore
          </>
        )}
      </div>
      {loading ? (
        <div className="[display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:28px_22px] max-[760px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[760px]:[gap:24px_13px]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div className="[min-width:0]" key={n}>
              <div className="[height:290px] [background:linear-gradient(90deg,_#ece9e1,_#f0eee8,_#ece9e1)] [background-size:200%] animate-pulse max-[1000px]:[height:250px] max-[760px]:[height:245px] max-[390px]:[height:215px]" />
              <div className="[height:11px] [width:80%] [background:#e7e4dc] [margin-top:15px]" />
              <div className="[height:11px] [width:80%] [background:#e7e4dc] [margin-top:15px] [width:48%] [margin-top:8px]" />
            </div>
          ))}
        </div>
      ) : data.items.length ? (
        <>
          <div className="[display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:28px_22px] max-[760px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[760px]:[gap:24px_13px] [grid-template-columns:repeat(4,_minmax(0,_1fr))] max-[760px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]">
            {data.items.map((book, i) => (
              <BookCard
                key={book._id}
                book={book}
                index={i}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
          {data.pages > 1 && (
            <div className="[display:flex] [justify-content:center] [align-items:center] [gap:27px] [margin:45px_0_0] [font-size:10px] [color:#727a71] max-[760px]:[gap:15px]">
              <button
                disabled={data.page <= 1}
                onClick={() => update("page", String(data.page - 1))}
              >
                <ChevronLeft size={17} /> Previous
              </button>
              <span>
                Page <b>{data.page}</b> of {data.pages}
              </span>
              <button
                disabled={data.page >= data.pages}
                onClick={() => update("page", String(data.page + 1))}
              >
                Next <ChevronRight size={17} />
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No books on this shelf yet"
          copy="Try another search or clear a filter to find your next read."
          action={
            <button
              className={`${"[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:#fff] [border-color:#c8cec6] [color:#5545de] [border:1px_solid_#dcd9ff]"}`}
              onClick={() => {
                setParams({});
                setQuery("");
              }}
            >
              Clear filters
            </button>
          }
        />
      )}
    </div>
  );
}
function BookDetail({ user, onAddToCart }) {
  const { id } = useParams(),
    nav = useNavigate(),
    [params, setParams] = useSearchParams(),
    [result, setResult] = useState(null),
    [loading, setLoading] = useState(true),
    [rating, setRating] = useState(5),
    [comment, setComment] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    api
      .get(`/books/${id}`)
      .then((r) => setResult(r.data))
      .catch((e) => toast.error(errorText(e)))
      .finally(() => setLoading(false));
  }, [id]);
  useEffect(() => {
    if (params.get("checkout") !== "cancel") return;
    if (!user) {
      nav(
        `/login?return=${encodeURIComponent(`/books/${id}?checkout=cancel`)}`,
      );
      return;
    }
    let active = true;
    api
      .post(`/payments/cancel/${id}`)
      .then(async ({ data }) => {
        if (!active) return;
        if (data.paid)
          toast.success(
            "Your payment was received and your order is being tracked.",
          );
        else if (data.released)
          toast.message("Checkout cancelled. This book is available again.");
        const book = await api.get(`/books/${id}`);
        if (active) setResult(book.data);
      })
      .catch((e) => {
        if (active) toast.error(errorText(e));
      })
      .finally(() => {
        if (active)
          setParams(
            {},
            {
              replace: true,
            },
          );
      });
    return () => {
      active = false;
    };
  }, [id, user, params.toString(), nav, setParams]);
  const request = () => {
    if (!user) {
      nav(`/login?return=${encodeURIComponent(`/books/${id}`)}`);
      return;
    }
    if (book.availability !== "available")
      return toast.error("This copy is not available right now.");
    onAddToCart?.(book);
    nav("/cart");
  };
  const review = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post(`/books/${id}/reviews`, {
        rating,
        comment,
      });
      toast.success("Thank you for sharing your review.");
      setComment("");
      const r = await api.get(`/books/${id}`);
      setResult(r.data);
    } catch (e) {
      toast.error(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  if (loading)
    return (
      <div className="[min-height:440px] [display:flex] [justify-content:center] [align-items:center] [gap:11px] [color:#758071] [font-size:12px]">
        <LoaderCircle className="animate-spin" /> Opening the book…
      </div>
    );
  if (!result) return <NotFound />;
  const { book, reviews, rating: ratingData } = result;
  const owner = user?.id === (book.owner?._id || book.owner);
  return (
    <div className="[max-width:1480px] [margin:0_auto] [padding:60px_48px_100px] max-[760px]:[padding:42px_22px_70px] [padding-top:38px] max-[760px]:[padding-top:28px]">
      <Link
        className="[display:inline-flex] [align-items:center] [gap:3px] [color:#737c72] [font-size:10px] [margin-bottom:33px]"
        to="/books"
      >
        <ChevronLeft size={16} /> Back to the shelves
      </Link>
      <div className="grid max-w-[1100px] grid-cols-[minmax(0,.85fr)_minmax(0,1fr)] items-center gap-[clamp(32px,6vw,88px)] max-[760px]:mx-auto max-[760px]:max-w-[500px] max-[760px]:grid-cols-1 max-[760px]:gap-8">
        <div className="relative aspect-[4/5] max-h-[600px] min-h-[400px] overflow-hidden rounded-[24px] border border-[#eeedfa] bg-[#f0eff6] shadow-[0_22px_55px_rgba(58,53,113,.13)] max-[760px]:mx-auto max-[760px]:min-h-0 max-[760px]:w-full max-[760px]:max-w-[340px]">
          <img
            className="h-full w-full object-cover"
            src={book.coverUrl || coverFallback}
            alt={`Cover of ${book.title}`}
            onError={(e) => (e.currentTarget.src = coverFallback)}
          />
          <span className="absolute right-4 top-4 rounded-xl border border-white/70 bg-white/90 px-3 py-2.5 text-[9px] font-bold leading-[1.45] tracking-[.12em] text-[#5b4be8] shadow-lg backdrop-blur">
            A LOCAL
            <br />
            FIND
          </span>
        </div>
        <div className="min-w-0">
          <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
            <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />
            {book.category}
          </div>
          <h1 className="break-words font-display text-[clamp(30px,3.4vw,44px)] font-black leading-tight tracking-[-.045em] text-[#222344]">{book.title}</h1>
          <p
            className={`${"[font-size:12px] [color:#858c83] [margin-bottom:21px]"}`}
          >
            by {book.author}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-[#e8e8f4] py-3 text-[11px] text-[#777993]">
            <span className="[display:inline-flex] [align-items:center] [gap:5px] [color:#b48643] [font-weight:700]">
              <Star size={16} fill="currentColor" />
              {Number(ratingData.average || 0).toFixed(1)}
            </span>
            <span>
              {ratingData.count} reader{" "}
              {ratingData.count === 1 ? "review" : "reviews"}
            </span>
            <i></i>
            <span>
              {book.availability === "available"
                ? "Available to borrow"
                : book.availability === "reserved"
                  ? "Checkout in progress"
                  : "Currently on loan"}
            </span>
          </div>
          {book.description?.trim() && (
            <section className="my-5 rounded-2xl border border-[#eeedfa] bg-[#fbfaff] p-4">
              <h2 className="text-xs font-extrabold uppercase tracking-[.08em] text-[#777794]">
                About this book
              </h2>
              <p className="mt-2 break-words text-sm leading-6 text-[#555673]">
                {book.description}
              </p>
            </section>
          )}
          <div className="[display:flex] [align-items:center] [gap:8px] [color:#798177] [font-size:10px]">
            <CircleUserRound size={20} />
            <span>
              From the shelves of{" "}
              <b>{book.owner?.name || "a local librarian"}</b>
            </span>
          </div>
          <div className="my-6 grid grid-cols-2 items-center gap-4 border-y border-[#e8e8f4] py-4 max-[420px]:grid-cols-1">
            <div>
              <small className="block text-xs font-semibold text-[#85869f]">Delivery fee</small>
              <strong className="mt-1 block text-lg font-extrabold text-[#29294f]">{money(book.deliveryFee)}</strong>
            </div>
            <span className="text-right text-sm font-semibold leading-5 text-[#555673] max-[420px]:text-left">
              One-time secure payment
              <br />
              processed by Stripe
            </span>
          </div>
          {owner ? (
            <div className="[background:#eaeee6] [padding:14px] [font-size:10px] [color:#5b4be8]">
              You’re the librarian for this listing. Manage it from your
              dashboard.
            </div>
          ) : user ? (
            <button
              className={`${"[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)] [width:100%] [justify-content:space-between] [height:50px]"}`}
              disabled={book.availability !== "available"}
              onClick={request}
            >
              <Truck size={17} />
              {book.availability === "available"
                ? "Add to cart"
                : "Currently unavailable"}{" "}
              <ArrowRight size={17} />
            </button>
          ) : null}
          <div className="[display:flex] [align-items:center] [gap:6px] [color:#93998f] [font-size:9px] [margin-top:12px]">
            <Shield size={15} /> Secure checkout · your card details stay
            private
          </div>
        </div>
      </div>
      <section className="[max-width:1000px] [margin:100px_auto_0] [padding-top:35px] [border-top:1px_solid_#e8e8f4] [display:grid] [grid-template-columns:0.8fr_1.2fr] [gap:70px] max-[760px]:[margin-top:65px] max-[760px]:[grid-template-columns:1fr] max-[760px]:[gap:15px]">
        <div className="">
          <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
            <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />{" "}
            NOTES FROM READERS
          </div>
          <h2 className="font-display text-[clamp(24px,2.5vw,34px)] font-extrabold leading-tight tracking-[-.04em] text-[#29294f]">
            A few words from the
            <br />
            <em>last page.</em>
          </h2>
        </div>
        <div className="[display:flex] [flex-direction:column] [gap:13px]">
          {reviews.length ? (
            reviews.map((r) => (
              <article
                className="[padding:18px] [background:#efeee7]"
                key={r._id}
              >
                <div className="[display:flex] [align-items:center] [gap:10px]">
                  <div className="[width:31px] [height:31px] [border-radius:50%] [background:#d7dfcf] [display:grid] [place-items:center] [color:#5b4be8] [font:600_14px_Trebuchet_MS,_ui-rounded,_system-ui,_sans-serif]">
                    {r.reader?.name?.[0] || "R"}
                  </div>
                  <div>
                    <b>{r.reader?.name || "Reader"}</b>
                    <small>{new Date(r.createdAt).toLocaleDateString()}</small>
                  </div>
                  <span className="[margin-left:auto] [color:#b48643] [font-size:10px] [letter-spacing:1px]">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </span>
                </div>
                <p className="text-[13px] leading-6 text-[#74758f]">{r.comment}</p>
              </article>
            ))
          ) : (
            <p
              className={`${"[font-size:10px] [color:#8b9188] [line-height:1.7]"}`}
            >
              No reader reviews yet. Your first impression can help someone else
              find the right book.
            </p>
          )}
        </div>
      </section>
      {user?.role === "user" && (
        <form
          className="[max-width:1000px] [margin:42px_auto_0] [padding:25px] [background:#efeee7] max-[760px]:[margin-top:27px] max-[760px]:[padding:18px]"
          onSubmit={review}
        >
          <h3 className="font-display text-lg font-extrabold leading-snug tracking-[-.02em] text-[#29294f]">Read it and loved it?</h3>
          <p className="text-[13px] leading-6 text-[#74758f]">Reviews open once your delivery has been marked complete.</p>
          <div className="[display:flex] [align-items:end] [gap:17px] max-[760px]:[align-items:stretch] max-[760px]:[flex-direction:column]">
            <label>
              Your rating
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className={`${"[flex:1]"}`}>
              Your review
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you think?"
                required
                minLength={5}
                maxLength={1200}
              />
            </label>
            <button
              className={`${"[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)]"}`}
              disabled={busy}
            >
              Post review <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
function AuthPage({ mode, setUser }) {
  const isRegister = mode === "register",
    nav = useNavigate(),
    [searchParams] = useSearchParams();
  const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      role: "user",
      avatar: "",
    }),
    [avatarFile, setAvatarFile] = useState(null),
    [busy, setBusy] = useState(false),
    [showPassword, setShowPassword] = useState(false),
    [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const change = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  const submit = async (e) => {
    e.preventDefault();
    if (isRegister && form.password !== e.currentTarget.confirmPassword.value)
      return toast.error("Your passwords do not match.");
    setBusy(true);
    try {
      const payload = {
        ...form,
      };
      if (avatarFile) payload.avatar = await uploadImage(avatarFile);
      const { data } = await api.post(
        isRegister ? "/auth/register" : "/auth/login",
        payload,
      );
      if (isRegister) {
        toast.success(
          "Verification email sent. Check your inbox and spam folder before signing in.",
        );
        nav("/login");
        return;
      }
      setUser(data.user);
      toast.success("Welcome back.");
      const returnTo = searchParams.get("return");
      nav(
        returnTo?.startsWith("/") && !returnTo.startsWith("//")
          ? returnTo
          : data.user.role === "user"
            ? "/"
            : "/dashboard/" + data.user.role,
      );
    } catch (e) {
      toast.error(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="grid min-h-[660px] grid-cols-2 overflow-hidden bg-[#f8f8ff] max-[760px]:grid-cols-1">
      <div className="relative min-h-[660px] overflow-hidden bg-[#29264f] max-[760px]:min-h-[240px]">
        <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=85" alt="A calm bookshop interior" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b173dcc] via-[#1b173d22] to-transparent" />
        <div className="absolute bottom-14 left-[10%] z-10 text-white max-[760px]:bottom-5 max-[760px]:left-[8%]">
          <span>“</span>
          <p className="text-lg font-medium leading-7 text-white">
            There is no friend as
            <br />
            loyal as a book.
          </p>
          <small>— ERNEST HEMINGWAY</small>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[520px] self-center px-12 py-14 max-[760px]:px-6 max-[760px]:py-10">
        <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
          <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />
          {isRegister ? "A PLACE FOR EVERY READER" : "BACK TO YOUR BOOKSHELF"}
        </div>
        <h1 className="font-display text-[clamp(30px,3.4vw,44px)] font-black leading-tight tracking-[-.045em] text-[#222344]">{isRegister ? "Find your next chapter." : "Welcome back."}</h1>
        <p className="text-[13px] leading-6 text-[#74758f]">
          {isRegister
            ? "Join readers and independent librarians bringing good books closer."
            : "Sign in to see what’s waiting on your shelf."}
        </p>
        <form
          className="mt-6 flex max-w-none flex-col gap-4"
          onSubmit={submit}
        >
          {isRegister && (
            <label className="flex flex-col gap-2 text-xs font-semibold text-[#656681]">
              Your name
              <input
                name="name"
                value={form.name}
                onChange={change}
                required
                minLength={2}
                placeholder="Alex Reader"
                className="w-full rounded-xl border border-[#e4e3f0] bg-white px-3.5 py-3 text-sm text-[#29294f] outline-none focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
              />
            </label>
          )}
          <label className="flex flex-col gap-2 text-xs font-semibold text-[#656681]">
            Email address
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={change}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[#e4e3f0] bg-white px-3.5 py-3 text-sm text-[#29294f] outline-none focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold text-[#656681]">
            Password
            <span className="relative block">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={change}
                required
                minLength={isRegister ? 8 : 1}
                placeholder={
                  isRegister ? "At least 8 characters" : "Your password"
                }
                className="w-full rounded-xl border border-[#e4e3f0] bg-white px-3.5 py-3 pr-12 text-sm text-[#29294f] outline-none focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 grid w-9 place-items-center rounded-lg text-[#85869f] transition hover:bg-[#f3f1ff] hover:text-[#5b4be8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7868f4]"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>
          {isRegister && (
            <>
              <label className="flex flex-col gap-2 text-xs font-semibold text-[#656681]">
                Confirm password
                <span className="relative block">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Enter it again"
                    className="w-full rounded-xl border border-[#e4e3f0] bg-white px-3.5 py-3 pr-12 text-sm text-[#29294f] outline-none focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 grid w-9 place-items-center rounded-lg text-[#85869f] transition hover:bg-[#f3f1ff] hover:text-[#5b4be8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7868f4]"
                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>
              <label className="flex flex-col gap-2 text-xs font-semibold text-[#656681]">
                Profile photo (optional)
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-dashed border-[#d8d6ec] bg-white p-3 text-xs text-[#777993] file:mr-3 file:rounded-lg file:border-0 file:bg-[#ece9ff] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#5b4be8]"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-semibold text-[#656681]">
                I’m joining as
                <select className="w-full rounded-xl border border-[#e4e3f0] bg-white px-3.5 py-3 text-sm text-[#29294f] outline-none focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10" name="role" value={form.role} onChange={change}>
                  <option value="user">A reader</option>
                  <option value="librarian">A librarian / book owner</option>
                </select>
              </label>
            </>
          )}
          {!isRegister && (
            <Link
              className="w-fit text-xs font-bold text-[#5b4be8] hover:underline"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
          )}
          <button
            className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7d6df6] to-[#5545de] px-5 text-sm font-extrabold text-white shadow-[0_9px_20px_rgba(91,75,232,.24)] transition hover:-translate-y-0.5 hover:saturate-125 disabled:cursor-not-allowed disabled:opacity-55"
            disabled={busy}
          >
            {busy ? <LoaderCircle className="animate-spin" size={17} /> : null}
            {isRegister ? "Create your account" : "Sign in"}{" "}
            <ArrowRight size={17} />
          </button>
        </form>
        <div className="mt-5 text-center text-xs text-[#777993]">
          {isRegister ? "Already have a place here?" : "New around here?"}{" "}
          <Link className="font-bold text-[#5b4be8] hover:underline" to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Log in" : "Create an account"}
          </Link>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#9293a8]">
          <Shield size={15} /> Your information is protected with secure
          sign-in.
        </div>
      </div>
    </div>
  );
}

function VerifyEmail({ setUser }) {
  const [params] = useSearchParams(),
    [verifiedUser, setVerifiedUser] = useState(null),
    [message, setMessage] = useState("Verifying your email…");
  useEffect(() => {
    api
      .post("/auth/verify-email", {
        token: params.get("token"),
      })
      .then((r) => {
        setUser(r.data.user);
        setVerifiedUser(r.data.user);
        setMessage("Your email is verified. Welcome to BiblioDrop!");
      })
      .catch((e) => setMessage(errorText(e)));
  }, []);
  return (
    <div className="[min-height:570px] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [text-align:center] [padding:65px_25px] max-[760px]:[min-height:520px]">
      <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
        <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />{" "}
        EMAIL VERIFICATION
      </div>
      <h1 className="font-display text-[clamp(30px,3.4vw,44px)] font-black leading-tight tracking-[-.045em] text-[#222344]">{message}</h1>
      <Link
        className="[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)]"
        to={verifiedUser ? `/dashboard/${verifiedUser.role}` : "/login"}
      >
        Continue to account <ArrowRight size={17} />
      </Link>
    </div>
  );
}
function PasswordPage({ mode }) {
  const [params] = useSearchParams(),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [done, setDone] = useState(false),
    [busy, setBusy] = useState(false),
    reset = mode === "reset";
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post(
        `/auth/${reset ? "reset-password" : "forgot-password"}`,
        reset
          ? {
              token: params.get("token"),
              password,
            }
          : {
              email,
            },
      );
      setDone(true);
      toast.success(data.message);
    } catch (e) {
      toast.error(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="[align-self:center] [max-width:450px] [width:100%] [margin:auto] [padding:55px_48px] max-[760px]:[padding:39px_26px_50px] [min-height:540px] [margin:auto] [padding-top:90px] [padding-bottom:90px]">
      <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
        <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />{" "}
        ACCOUNT HELP
      </div>
      <h1 className="font-display text-[clamp(30px,3.4vw,44px)] font-black leading-tight tracking-[-.045em] text-[#222344]">{reset ? "Choose a new password" : "Reset your password"}</h1>
      <p className="text-[13px] leading-6 text-[#74758f]">
        {done
          ? "You can continue to sign in."
          : reset
            ? "Use a new password with at least 8 characters."
            : "We’ll email you a secure reset link if the account exists."}
      </p>
      {!done && (
        <form
          className="[display:flex] [flex-direction:column] [gap:14px] [max-width:none]"
          onSubmit={submit}
        >
          {reset ? (
            <label>
              New password
              <input
                required
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          ) : (
            <label>
              Email address
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          )}
          <button
            className={`${"[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)] [width:100%] [margin-top:4px]"}`}
            disabled={busy}
          >
            {busy ? <LoaderCircle className="animate-spin" size={17} /> : null}
            {reset ? "Save password" : "Send reset link"}{" "}
            <ArrowRight size={17} />
          </button>
        </form>
      )}
      <div className="[font-size:10px] [text-align:center] [color:#7e857c] [margin-top:20px]">
        <Link to="/login">Back to sign in</Link>
      </div>
    </div>
  );
}
function ProfileSettings({ user, setUser }) {
  const [name, setName] = useState(user.name),
    [email, setEmail] = useState(user.email),
    [avatar, setAvatar] = useState(user.avatar || ""),
    [file, setFile] = useState(null),
    [profilePassword, setProfilePassword] = useState(""),
    [currentPassword, setCurrentPassword] = useState(""),
    [newPassword, setNewPassword] = useState(""),
    [confirmPassword, setConfirmPassword] = useState(""),
    [profileBusy, setProfileBusy] = useState(false),
    [passwordBusy, setPasswordBusy] = useState(false);
  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileBusy(true);
    try {
      const image = file ? await uploadImage(file) : avatar;
      const payload = {
        name,
        email,
        avatar: image,
      };
      if (email.toLowerCase() !== user.email.toLowerCase())
        payload.currentPassword = profilePassword;
      const { data } = await api.patch("/auth/profile", payload);
      setUser(data.user);
      setAvatar(data.user.avatar || "");
      setFile(null);
      setProfilePassword("");
      toast.success(
        data.emailVerificationSent
          ? "Verification link sent to your new email. Verify it to finish changing your email."
          : "Profile updated.",
      );
    } catch (e) {
      toast.error(errorText(e));
    } finally {
      setProfileBusy(false);
    }
  };
  const changePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return toast.error("The new passwords do not match.");
    setPasswordBusy(true);
    try {
      const { data } = await api.patch("/auth/password", {
        currentPassword,
        password: newPassword,
      });
      toast.success(data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      toast.error(errorText(e));
    } finally {
      setPasswordBusy(false);
    }
  };
  return (
    <div className="grid grid-cols-2 items-start gap-6 max-[900px]:grid-cols-1">
      <section className="w-full rounded-[24px] border border-[#ecebfa] bg-white p-6 shadow-[0_12px_30px_rgba(58,53,113,.06)] max-[760px]:rounded-[18px] max-[760px]:p-5">
        <div className="[margin-bottom:20px]">
          <div>
            <span className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
              <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />{" "}
              ACCOUNT DETAILS
            </span>
            <h3 className="font-display text-lg font-extrabold leading-snug tracking-[-.02em] text-[#29294f]">Edit your profile</h3>
            <p className="text-[13px] leading-6 text-[#74758f]">
              Update the name and photo shown across your BiblioDrop account.
            </p>
          </div>
        </div>
        <div className="mb-5 flex min-w-0 items-center gap-4 rounded-2xl border border-[#e9e7fb] bg-gradient-to-r from-[#f1eeff] to-[#fff3f7] p-4">
          {avatar ? (
            <img className="h-[76px] w-[76px] shrink-0 rounded-full border-4 border-white object-cover shadow-md" src={avatar} alt="Profile" />
          ) : (
            <span className="grid h-[76px] w-[76px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8677ff] to-[#5b4be8] text-2xl font-bold text-white shadow-md">{name?.[0]?.toUpperCase()}</span>
          )}
          <div className="min-w-0">
            <b className="block truncate font-display text-base font-extrabold text-[#29294f]">{name || user.name}</b>
            <small className="mt-1 block break-all text-xs leading-5 text-[#81819b]">
              {roleLabel(user.role)} account · {user.email}
            </small>
          </div>
        </div>
        <form
          className="flex max-w-none flex-col gap-4"
          onSubmit={saveProfile}
        >
          <label className="flex flex-col gap-2 text-xs font-semibold text-[#656681]">
            Full name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={80}
              className="w-full rounded-xl border border-[#e4e3f0] bg-[#fcfcff] px-3.5 py-3 text-sm text-[#29294f] outline-none transition focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold text-[#656681]">
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-[#e4e3f0] bg-[#fcfcff] px-3.5 py-3 text-sm text-[#29294f] outline-none transition focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
            />
          </label>
          {email.toLowerCase() !== user.email.toLowerCase() && (
            <label className="flex flex-col gap-2 text-xs font-semibold text-[#656681]">
              Current password (to verify email change)
              <input
                type="password"
                value={profilePassword}
                onChange={(e) => setProfilePassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-[#e4e3f0] bg-[#fcfcff] px-3.5 py-3 text-sm text-[#29294f] outline-none transition focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
              />
            </label>
          )}
          <label className="flex flex-col gap-2 text-xs font-semibold text-[#656681]">
            Profile photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full cursor-pointer rounded-xl border border-dashed border-[#d8d6ec] bg-[#fcfcff] p-3 text-xs text-[#777993] file:mr-3 file:rounded-lg file:border-0 file:bg-[#ece9ff] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#5b4be8]"
            />
          </label>
          <button
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7d6df6] to-[#5545de] px-5 text-xs font-extrabold text-white shadow-[0_9px_20px_rgba(91,75,232,.24)] transition hover:-translate-y-0.5 hover:saturate-125 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={profileBusy}
          >
            {profileBusy ? "Saving…" : "Save profile changes"}
          </button>
        </form>
      </section>
      <section className="w-full rounded-[24px] border border-[#ecebfa] bg-white p-6 shadow-[0_12px_30px_rgba(58,53,113,.06)] max-[760px]:rounded-[18px] max-[760px]:p-5">
        <div className="[margin-bottom:20px]">
          <div>
            <span className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
              <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />{" "}
              ACCOUNT SECURITY
            </span>
            <h3 className="font-display text-lg font-extrabold leading-snug tracking-[-.02em] text-[#29294f]">Change password</h3>
            <p className="text-[13px] leading-6 text-[#74758f]">Choose a new password with at least 8 characters.</p>
          </div>
        </div>
        <form
          className="flex max-w-none flex-col gap-4"
          onSubmit={changePassword}
        >
          <label className="flex flex-col gap-2 text-xs font-semibold text-[#656681]">
            Current password
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-[#e4e3f0] bg-[#fcfcff] px-3.5 py-3 text-sm text-[#29294f] outline-none transition focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold text-[#656681]">
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-xl border border-[#e4e3f0] bg-[#fcfcff] px-3.5 py-3 text-sm text-[#29294f] outline-none transition focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold text-[#656681]">
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-xl border border-[#e4e3f0] bg-[#fcfcff] px-3.5 py-3 text-sm text-[#29294f] outline-none transition focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
            />
          </label>
          <button
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7d6df6] to-[#5545de] px-5 text-xs font-extrabold text-white shadow-[0_9px_20px_rgba(91,75,232,.24)] transition hover:-translate-y-0.5 hover:saturate-125 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={passwordBusy}
          >
            {passwordBusy ? "Updating…" : "Update password"}
          </button>
        </form>
      </section>
    </div>
  );
}
function CartPage({ cart, setCart, user }) {
  const [address, setAddress] = useState(""),
    [city, setCity] = useState(""),
    [area, setArea] = useState(""),
    [country, setCountry] = useState(""),
    [coords, setCoords] = useState(null),
    [busy, setBusy] = useState(false),
    [locating, setLocating] = useState(false),
    nav = useNavigate();
  const locate = () => {
    if (!navigator.geolocation)
      return toast.error("Location is not supported by this browser.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        const point = {
          latitude: p.coords.latitude,
          longitude: p.coords.longitude,
        };
        setCoords(point);
        setAddress(
          `GPS delivery pin (${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)})`,
        );
        try {
          const { data } = await api.post("/location/reverse", point);
          setAddress(
            data.streetAddress ||
              data.formattedAddress ||
              `GPS delivery pin (${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)})`,
          );
          setCity(data.city || "");
          setArea(data.area || "");
          setCountry(data.country || "");
          toast.success("Your delivery location was detected.");
        } catch {
          toast.message(
            "Using your GPS pin. The map service could not find a street address.",
          );
        } finally {
          setLocating(false);
        }
      },
      (e) => {
        toast.error(e.message || "Allow location access to continue.");
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
      },
    );
  };
  useEffect(() => {
    if (user && cart.length && !coords && !locating) locate();
  }, [user, cart.length]);
  const checkout = async () => {
    if (!user) {
      nav(`/login?return=${encodeURIComponent("/cart")}`);
      return;
    }
    if (!cart.length) return;
    if (!coords) return toast.error("Allow phone location access to continue.");
    setBusy(true);
    try {
      const { data } = await api.post("/payments/checkout", {
        bookIds: cart.map((b) => b._id),
        location: {
          address:
            address ||
            `GPS delivery pin (${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)})`,
          city,
          area,
          country,
          ...coords,
        },
      });
      window.location.assign(data.url);
    } catch (e) {
      toast.error(errorText(e));
      setBusy(false);
    }
  };
  return (
    <div className="[max-width:1480px] [margin:0_auto] [padding:60px_48px_100px] max-[760px]:[padding:42px_22px_70px]">
      <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
        <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />{" "}
        YOUR NEXT DELIVERY
      </div>
      <h1 className="font-display text-[clamp(30px,3.4vw,44px)] font-black leading-tight tracking-[-.045em] text-[#222344]">Your cart</h1>
      {!cart.length ? (
        <EmptyState
          title="Your cart is empty"
          copy="Find a book to start your next reading adventure."
          action={
            <Link
              className="[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)]"
              to="/books"
            >
              Browse books <ArrowRight size={16} />
            </Link>
          }
        />
      ) : (
        <div className="mt-5 grid min-w-0 grid-cols-[minmax(0,1.25fr)_minmax(300px,.75fr)] items-start gap-6 max-[900px]:grid-cols-1">
          <div className="grid min-w-0 gap-3">
            {cart.map((book) => (
              <article
                className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#e8e8f4] bg-white p-4 shadow-[0_8px_24px_rgba(58,53,113,.05)] max-[520px]:gap-3 max-[520px]:p-3"
                key={book._id}
              >
                <img className="h-[112px] w-[82px] shrink-0 rounded-xl object-cover shadow-sm max-[520px]:h-24 max-[520px]:w-[70px]" src={book.coverUrl || coverFallback} alt={`Cover of ${book.title}`} />
                <div className="min-w-0 flex-1">
                  <b className="block truncate font-display text-base font-extrabold text-[#29294f]">{book.title}</b>
                  <small className="mt-1 block truncate text-xs text-[#85869f]">by {book.author}</small>
                  <span className="mt-3 inline-flex rounded-full bg-[#f3f0ff] px-2.5 py-1 text-xs font-bold text-[#6356c7]">{money(book.deliveryFee)} delivery</span>
                </div>
                <button
                  className="shrink-0 rounded-lg px-3 py-2 text-xs font-bold text-[#ba5b72] transition hover:bg-[#fff0f3]"
                  onClick={() =>
                    setCart((items) => items.filter((i) => i._id !== book._id))
                  }
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
          <div className="grid min-w-0 gap-4 rounded-[24px] border border-[#ecebfa] bg-white p-6 shadow-[0_12px_30px_rgba(58,53,113,.06)] max-[760px]:rounded-[18px] max-[760px]:p-5">
            <h2 className="font-display text-[clamp(24px,2.5vw,34px)] font-extrabold leading-tight tracking-[-.04em] text-[#29294f]">Delivery location</h2>
            {locating ? (
              <div className="">
                <LoaderCircle className="animate-spin" size={18} /> Finding your
                delivery address…
              </div>
            ) : (
              <div className="grid w-full min-w-0 grid-cols-2 gap-3 overflow-hidden rounded-2xl border border-[#e7e5f5] bg-gradient-to-br from-[#f8f8ff] to-[#f1f7ff] p-4 text-xs text-[#545573] max-[520px]:gap-2 max-[520px]:p-3">
                <b className="col-span-2 break-words font-semibold text-[#343451]">{address || "Waiting for phone location permission"}</b>
                <span>City: {city || "Unavailable"}</span>
                {area && <span>Area: {area}</span>}
                {coords && (
                  <small className="col-span-2 break-words text-[10px] text-[#8889a2]">
                    GPS pin: {coords.latitude.toFixed(5)},{" "}
                    {coords.longitude.toFixed(5)}
                  </small>
                )}
              </div>
            )}
            <button
              className={`${"[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:#fff] [border-color:#c8cec6] [color:#5545de] [border:1px_solid_#dcd9ff]"}`}
              type="button"
              disabled={locating}
              onClick={locate}
            >
              <Compass size={16} />
              {locating
                ? "Finding location…"
                : coords
                  ? "Refresh detected location"
                  : "Detect phone location"}
            </button>
            <p
              className={`${"[font-size:9px] [line-height:1.5] [color:#777] [margin-top:-8px]"}`}
            >
              Coordinates are used to look up the address through OpenStreetMap.
              © OpenStreetMap contributors. If no street address is available,
              delivery uses your GPS pin.
            </p>
            <strong className="flex items-center justify-between rounded-xl bg-[#f8f7ff] px-4 py-3 text-sm font-extrabold text-[#302d61]">
              Total delivery fee:{" "}
              {money(
                cart.reduce((sum, b) => sum + Number(b.deliveryFee || 0), 0),
              )}
            </strong>
            <button
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7d6df6] to-[#5545de] px-5 text-xs font-extrabold text-white shadow-[0_9px_20px_rgba(91,75,232,.24)] transition hover:-translate-y-0.5 hover:saturate-125 disabled:cursor-not-allowed disabled:opacity-55"
              disabled={busy || locating || !coords || !cart.length}
              onClick={checkout}
            >
              {busy ? (
                <LoaderCircle className="animate-spin" size={17} />
              ) : (
                <Shield size={16} />
              )}{" "}
              Continue to secure payment <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
function PaymentCancel({ user }) {
  const [params] = useSearchParams(),
    [message, setMessage] = useState("Checking payment status…");
  const sessionId = params.get("session_id");
  useEffect(() => {
    if (!sessionId)
      return setMessage("Checkout was cancelled. Your cart is still saved.");
    if (!user) return setMessage("Sign in to finish checking your payment.");
    api
      .post("/payments/cancel", {
        sessionId,
      })
      .then(({ data }) =>
        setMessage(
          data.paid
            ? "Payment received. Your order is available in tracking."
            : "Checkout cancelled. Your cart is still saved.",
        ),
      )
      .catch((e) => setMessage(errorText(e)));
  }, [sessionId, user]);
  return (
    <div className="[min-height:570px] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [text-align:center] [padding:65px_25px] max-[760px]:[min-height:520px]">
      <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
        <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />{" "}
        CHECKOUT
      </div>
      <h1 className="font-display text-[clamp(30px,3.4vw,44px)] font-black leading-tight tracking-[-.045em] text-[#222344]">Payment update</h1>
      <p className="text-[13px] leading-6 text-[#74758f]">{message}</p>
      <div className="[display:flex] [align-items:center] [gap:23px] [margin:16px_0] max-[760px]:[flex-direction:column]">
        {user && (
          <Link
            className="[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)]"
            to="/cart"
          >
            Return to cart <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
function PaymentSuccess({ user, setCart }) {
  const [params] = useSearchParams(),
    [message, setMessage] = useState(
      "Confirming your payment and creating your order…",
    ),
    [ready, setReady] = useState(false),
    [orderNumber, setOrderNumber] = useState("");
  const sessionId = params.get("session_id");
  useEffect(() => {
    if (!sessionId)
      return setMessage(
        "Payment session is missing. Check your order history or contact support.",
      );
    if (!user)
      return setMessage(
        "Sign in with the account used for checkout to finish confirming your order.",
      );
    let active = true;
    (async () => {
      for (let attempt = 0; attempt < 4 && active; attempt++) {
        try {
          const { data } = await api.post("/payments/confirm", {
            sessionId,
          });
          if (active) {
            setOrderNumber(data.orderNumber || "");
            setReady(true);
            setCart([]);
            setMessage(
              "Payment confirmed. Your order is now available to track.",
            );
          }
          return;
        } catch (e) {
          if (e.response?.status === 409 && attempt < 3) {
            await new Promise((r) => setTimeout(r, 1200));
            continue;
          }
          if (active) setMessage(errorText(e));
          return;
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [sessionId, user]);
  return (
    <div className="[min-height:570px] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [text-align:center] [padding:65px_25px] max-[760px]:[min-height:520px]">
      <div className="[width:58px] [height:58px] [border-radius:50%] [background:#e1e9dc] [color:#5b4be8] [display:grid] [place-items:center] [margin-bottom:24px]">
        {ready ? (
          <Check size={30} />
        ) : (
          <LoaderCircle className="animate-spin" size={27} />
        )}
      </div>
      <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
        <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />{" "}
        {ready ? "PAYMENT CONFIRMED" : "ORDER CONFIRMATION"}
      </div>
      <h1 className="font-display text-[clamp(30px,3.4vw,44px)] font-black leading-tight tracking-[-.045em] text-[#222344]">
        {ready ? (
          <>
            Your next chapter
            <br />
            <em>is on its way.</em>
          </>
        ) : (
          <>
            Finishing your
            <br />
            <em>order…</em>
          </>
        )}
      </h1>
      <p className="text-[13px] leading-6 text-[#74758f]">{message}</p>
      {ready && orderNumber && (
        <p
          className={`${"[padding:10px_18px] [background:#f4efe1] [border-radius:30px] [color:#684736]"}`}
        >
          Order number <b>{orderNumber}</b>
        </p>
      )}
      <div className="[display:flex] [align-items:center] [gap:23px] [margin:16px_0] max-[760px]:[flex-direction:column]">
        {ready && (
          <Link
            className="[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)]"
            to={`/dashboard/${user?.role || "user"}`}
          >
            Track my order <ArrowRight size={17} />
          </Link>
        )}
        {!user && sessionId && (
          <Link
            className="[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)]"
            to={`/login?return=${encodeURIComponent(`/payment/success?session_id=${sessionId}`)}`}
          >
            Sign in to continue <ArrowRight size={17} />
          </Link>
        )}
        <Link
          className="[display:inline-flex] [align-items:center] [gap:8px] [color:#5b4be8] [font-weight:700] [font-size:12px] [background:none] [border:0] [padding:0_5px_11px] max-[760px]:[align-self:flex-start] max-[760px]:[padding:5px]"
          to="/books"
        >
          Back to the shelves
        </Link>
      </div>
    </div>
  );
}
function Dashboard({ user, setUser }) {
  const nav = useNavigate(),
    { role } = useParams(),
    [searchParams] = useSearchParams(),
    [data, setData] = useState(null),
    [adminBooks, setAdminBooks] = useState([]),
    [adminUsers, setAdminUsers] = useState([]),
    [tab, setTab] = useState(() =>
      searchParams.get("tab") === "profile" ? "profile" : "overview",
    ),
    [loading, setLoading] = useState(true),
    [refresh, setRefresh] = useState(0),
    [adding, setAdding] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => setRefresh((value) => value + 1), 15000);
    return () => clearInterval(timer);
  }, [role]);
  useEffect(() => {
    if (searchParams.get("tab") === "profile") setTab("profile");
  }, [searchParams]);
  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
    if (user.role !== role) {
      nav("/dashboard/" + user.role);
      return;
    }
    const calls = [api.get("/dashboard/summary")];
    if (role === "admin")
      calls.push(
        api.get("/admin/books"),
        api.get("/admin/users"),
        api.get("/admin/deliveries"),
      );
    Promise.all(calls)
      .then(([s, b, u, d]) => {
        setData(s.data);
        if (b) setAdminBooks(b.data);
        if (u) setAdminUsers(u.data);
        if (d)
          setData((x) => ({
            ...s.data,
            allDeliveries: d.data,
          }));
      })
      .catch((e) => toast.error(errorText(e)))
      .finally(() => setLoading(false));
  }, [user, role, nav, refresh]);
  if (!user) return null;
  const titles = {
    user: "Your reading room",
    librarian: "Your library",
    admin: "The BiblioDrop desk",
  };
  const names = {
    overview: "Overview",
    deliveries: role === "user" ? "Delivery tracking" : "Orders & tracking",
    reading: "My reading list",
    inventory: role === "admin" ? "Inventory" : "My inventory",
    reviews: "My reviews",
    approvals: "Approval queue",
    books: "All books",
    users: "Manage users",
    transactions: "Transactions",
  };
  const tabs =
    role === "user"
      ? ["overview", "deliveries", "reading", "reviews", "profile"]
      : role === "librarian"
        ? ["overview", "inventory", "deliveries", "profile"]
        : [
            "overview",
            "approvals",
            "books",
            "inventory",
            "users",
            "deliveries",
            "transactions",
            "profile",
          ];
  const refreshAll = () => setRefresh((n) => n + 1);
  names.profile = "My profile";
  if (loading)
    return (
      <div className="[min-height:440px] [display:flex] [justify-content:center] [align-items:center] [gap:11px] [color:#758071] [font-size:12px]">
        <LoaderCircle className="animate-spin" /> Setting up your reading room…
      </div>
    );
  return (
    <div className="grid min-h-[calc(100vh-78px)] grid-cols-[255px_minmax(0,1fr)] items-start bg-[radial-gradient(ellipse_at_83%_10%,#f0edff_0,transparent_34rem),#f7f8ff] max-[760px]:block">
      <aside className="fixed left-0 top-[78px] z-30 flex h-[calc(100vh-78px)] w-[255px] min-h-0 flex-col overflow-y-auto border-r border-[#e9e7fb] bg-white/90 px-[18px] py-[27px] shadow-[7px_0_25px_rgba(61,56,122,.04)] backdrop-blur-[14px] max-[760px]:sticky max-[760px]:top-[70px] max-[760px]:z-[25] max-[760px]:block max-[760px]:h-auto max-[760px]:max-h-none max-[760px]:min-h-0 max-[760px]:w-full max-[760px]:overflow-x-auto max-[760px]:overflow-y-hidden max-[760px]:whitespace-nowrap max-[760px]:rounded-b-[18px] max-[760px]:border-0 max-[760px]:border-b max-[760px]:px-3.5 max-[760px]:py-2 max-[760px]:bg-white/95">
        <div className="mb-2 flex items-center gap-3 rounded-[20px] border border-[#eeeaff] bg-gradient-to-r from-[#f3f0ff] to-[#fff3f7] px-4 py-3.5 max-[760px]:hidden">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e9e6ff] font-display text-sm font-black text-[#5b4be8]">{user.name?.[0]?.toUpperCase()}</span>
          <div className="min-w-0">
            <b className="block truncate text-sm font-extrabold text-[#29294f]">{user.name}</b>
            <small className="mt-0.5 block text-[10px] font-semibold text-[#85869f]">{roleLabel(user.role)}</small>
          </div>
        </div>
        <div className="[font-size:8px] [letter-spacing:1.5px] [color:#9b9ab8] [margin:23px_8px_10px] [font-weight:800] max-[760px]:[display:none]">
          YOUR SPACE
        </div>
        {tabs.map((t) => (
          <button
            key={t}
            className={`${tab === t ? "[display:flex] [align-items:center] [gap:11px] [width:100%] [padding:12px_13px] [background:transparent] [border:0] [border-radius:14px] [text-align:left] [color:#666887] [font-size:11px] [margin:4px_0] [position:relative] [transition:background_0.18s_ease,_color_0.18s_ease,_transform_0.18s_ease] [font-weight:700] max-[760px]:[display:inline-flex] max-[760px]:[width:auto] max-[760px]:[margin:0_5px_0_0] max-[760px]:[padding:9px_12px] max-[760px]:[font-size:9px] max-[760px]:[border-radius:999px] max-[760px]:[background:#f6f5ff] hover:[background:#f2f0ff] hover:[color:#5143d2] hover:[transform:translateX(2px)] max-[760px]:hover:[transform:none] [color:#5143d2] [font-weight:700] [background:linear-gradient(100deg,_#ebe8ff,_#f4f1ff)] [box-shadow:inset_3px_0_#7262ed] max-[760px]:[background:#e9e6ff]" : "[display:flex] [align-items:center] [gap:11px] [width:100%] [padding:12px_13px] [background:transparent] [border:0] [border-radius:14px] [text-align:left] [color:#666887] [font-size:11px] [margin:4px_0] [position:relative] [transition:background_0.18s_ease,_color_0.18s_ease,_transform_0.18s_ease] [font-weight:700] max-[760px]:[display:inline-flex] max-[760px]:[width:auto] max-[760px]:[margin:0_5px_0_0] max-[760px]:[padding:9px_12px] max-[760px]:[font-size:9px] max-[760px]:[border-radius:999px] max-[760px]:[background:#f6f5ff] hover:[background:#f2f0ff] hover:[color:#5143d2] hover:[transform:translateX(2px)] max-[760px]:hover:[transform:none]"}`}
            onClick={() => {
              setTab(t);
              nav(`/dashboard/${role}?tab=${t}`, {
                replace: true,
              });
            }}
          >
            {tabIcon(t)}
            {names[t]}
          </button>
        ))}
        <Link
          className="[display:flex] [align-items:center] [gap:8px] [font-size:9px] [color:#716f94] [border-top:1px_solid_#d6dbd1] [margin-top:auto] [padding:20px_7px] [border-color:#eeedfa] max-[760px]:[display:none]"
          to="/"
        >
          <ArrowRight size={15} /> Back to BiblioDrop
        </Link>
        <div className="[display:flex] [align-items:center] [gap:11px] [padding:13px] [background:linear-gradient(130deg,_#e9fff8,_#e7f2ff)] [color:#347f79] [font:italic_12px/1.45_Trebuchet_MS,_ui-rounded,_system-ui,_sans-serif] [border-radius:18px] max-[760px]:[display:none]">
          <BookOpen size={18} />
          <span>
            Every great story
            <br />
            starts somewhere.
          </span>
        </div>
      </aside>
      <section className="col-start-2 mx-auto w-full min-w-0 max-w-[1540px] px-[clamp(24px,4vw,64px)] pb-[70px] pt-[37px] max-[760px]:col-start-auto max-[760px]:max-w-none max-[760px]:px-[17px] max-[760px]:pb-[46px] max-[760px]:pt-6">
        <div className="[display:flex] [align-items:center] [justify-content:space-between] [border-bottom:1px_solid_#dfded5] [padding-bottom:20px] [border-color:#e7e7f3] max-[760px]:[align-items:flex-start]">
          <div>
            <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
              <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />{" "}
              {roleLabel(user.role).toUpperCase()} SPACE
            </div>
            <h1 className="font-display text-[clamp(30px,3.4vw,44px)] font-black leading-tight tracking-[-.045em] text-[#222344]">{titles[role]}</h1>
          </div>
          <span className="[font-size:9px] [color:#838a81] max-[760px]:[font-size:8px] max-[760px]:[text-align:right] max-[760px]:[max-width:120px]">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="[display:flex] [justify-content:space-between] [align-items:center] [margin:25px_0_17px]">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-[#2a294f] max-[760px]:text-xl">{names[tab]}</h2>
          {((role === "librarian" &&
            (tab === "inventory" || tab === "overview")) ||
            (role === "admin" && tab === "books")) && (
            <button
              className={`${"[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)]"}`}
              onClick={() => setAdding(true)}
            >
              + Add a book
            </button>
          )}
        </div>
        {tab === "overview" && (
          <Overview role={role} data={data || {}} onUpdate={refreshAll} />
        )}
        {tab === "deliveries" && role === "librarian" && (
          <div className="">
            <section className="[padding:24px] [background:rgb(255_255_255_/_91%)] [border:1px_solid_#eeedfa] [margin-bottom:17px] [border-radius:22px] [box-shadow:0_12px_30px_rgb(58_53_113_/_6%)] [margin:0] max-[760px]:[padding:17px] max-[760px]:[border-radius:18px]">
              <div className="[display:flex] [justify-content:space-between] [align-items:center] [margin-bottom:15px]">
                <div>
                  <h3 className="font-display text-lg font-extrabold leading-snug tracking-[-.02em] text-[#29294f]">Orders to fulfill</h3>
                  <p className="text-[13px] leading-6 text-[#74758f]">Orders placed for books from your library.</p>
                </div>
              </div>
              <DeliveryTable
                rows={data?.deliveries || []}
                librarian
                onUpdate={refreshAll}
              />
            </section>
            <section className="[padding:24px] [background:rgb(255_255_255_/_91%)] [border:1px_solid_#eeedfa] [margin-bottom:17px] [border-radius:22px] [box-shadow:0_12px_30px_rgb(58_53_113_/_6%)] [margin:0] max-[760px]:[padding:17px] max-[760px]:[border-radius:18px]">
              <div className="[display:flex] [justify-content:space-between] [align-items:center] [margin-bottom:15px]">
                <div>
                  <h3 className="font-display text-lg font-extrabold leading-snug tracking-[-.02em] text-[#29294f]">Orders you placed</h3>
                  <p className="text-[13px] leading-6 text-[#74758f]">Track books you ordered as a reader.</p>
                </div>
              </div>
              <DeliveryTable rows={data?.customerOrders || []} />
            </section>
          </div>
        )}
        {tab === "deliveries" && role !== "librarian" && (
          <DeliveryTable
            rows={role === "admin" ? data?.allDeliveries : data?.deliveries}
            librarian={role === "admin"}
            admin={role === "admin"}
            onUpdate={refreshAll}
          />
        )}
        {tab === "reading" && <ReadingList rows={data?.deliveries || []} />}
        {tab === "inventory" && role === "admin" && (
          <AdminInventory books={adminBooks} onRefresh={refreshAll} />
        )}
        {tab === "inventory" && role === "librarian" && (
          <LibrarianInventory
            books={data?.books || []}
            onRefresh={refreshAll}
          />
        )}
        {tab === "reviews" && <MyReviews reviews={data?.reviews || []} />}
        {tab === "approvals" && (
          <AdminApprovals books={adminBooks} onRefresh={refreshAll} />
        )}
        {tab === "books" && (
          <AdminBooks books={adminBooks} onRefresh={refreshAll} />
        )}
        {tab === "users" && (
          <AdminUsers users={adminUsers} onRefresh={refreshAll} />
        )}
        {tab === "transactions" && (
          <TransactionTable rows={data?.allDeliveries || []} />
        )}
        {tab === "profile" && <ProfileSettings user={user} setUser={setUser} />}
      </section>
      {adding && (
        <BookModal
          admin={role === "admin"}
          close={() => setAdding(false)}
          done={() => {
            setAdding(false);
            refreshAll();
          }}
        />
      )}
    </div>
  );
}
function roleLabel(role) {
  return role === "user"
    ? "Reader"
    : role === "librarian"
      ? "Librarian"
      : "Administrator";
}
function tabIcon(tab) {
  const Icon =
    {
      overview: BookOpen,
      deliveries: PackageCheck,
      inventory: Library,
      reviews: Star,
      approvals: Check,
      books: BookOpen,
      users: CircleUserRound,
      transactions: Shield,
      profile: CircleUserRound,
    }[tab] || BookOpen;
  return <Icon size={17} />;
}
function Overview({ role, data, onUpdate }) {
  if (role === "user")
    return (
      <>
        <div className="[display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:14px] [margin-bottom:21px] max-[1000px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[760px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[760px]:[gap:9px]">
          <Stat
            icon={<BookOpen />}
            label="Books read"
            value={data.totalRead || 0}
            tone="mint"
          />
          <Stat
            icon={<Clock3 />}
            label="On the way"
            value={data.pending || 0}
            tone="peach"
          />
          <Stat
            icon={<Shield />}
            label="Delivery fees"
            value={money(data.spent)}
            tone="lavender"
          />
        </div>
        <div className="[padding:24px] [background:rgb(255_255_255_/_91%)] [border:1px_solid_#eeedfa] [margin-bottom:17px] [border-radius:22px] [box-shadow:0_12px_30px_rgb(58_53_113_/_6%)] [margin:0] max-[760px]:[padding:17px] max-[760px]:[border-radius:18px]">
          <div className="[display:flex] [justify-content:space-between] [align-items:center] [margin-bottom:15px]">
            <div>
              <h3 className="font-display text-lg font-extrabold leading-snug tracking-[-.02em] text-[#29294f]">Your latest deliveries</h3>
              <p className="text-[13px] leading-6 text-[#74758f]">Every good read has a journey.</p>
            </div>
          </div>
          <DeliveryTable rows={(data.deliveries || []).slice(0, 5)} compact />
        </div>
        <div className="[position:relative] [background:rgb(255_255_255_/_91%)] [padding:22px_25px_20px_60px] [color:#5b4be8] [border:1px_solid_#eeedfa] [border-radius:22px] [box-shadow:0_12px_30px_rgb(58_53_113_/_6%)] max-[760px]:[padding:18px_17px_18px_50px]">
          <span>“</span>
          <p className="text-[13px] leading-6 text-[#74758f]">
            Reading is a conversation. All books talk. But a good book listens
            as well.
          </p>
          <small>— MARK HADDON</small>
        </div>
      </>
    );
  if (role === "librarian")
    return (
      <>
        <div className="[display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:14px] [margin-bottom:21px] max-[1000px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[760px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[760px]:[gap:9px]">
          <Stat
            icon={<Library />}
            label="Books listed"
            value={data.totalBooks || 0}
            tone="mint"
          />
          <Stat
            icon={<Clock3 />}
            label="Active requests"
            value={data.active || 0}
            tone="peach"
          />
          <Stat
            icon={<Shield />}
            label="Delivery revenue"
            value={money(data.earnings)}
            tone="lavender"
          />
        </div>
        <div className="[padding:24px] [background:rgb(255_255_255_/_91%)] [border:1px_solid_#eeedfa] [margin-bottom:17px] [border-radius:22px] [box-shadow:0_12px_30px_rgb(58_53_113_/_6%)] [margin:0] max-[760px]:[padding:17px] max-[760px]:[border-radius:18px]">
          <div className="[display:flex] [justify-content:space-between] [align-items:center] [margin-bottom:15px]">
            <div>
              <h3 className="font-display text-lg font-extrabold leading-snug tracking-[-.02em] text-[#29294f]">Your bookshelves</h3>
              <p className="text-[13px] leading-6 text-[#74758f]">Recent listings and their approval status.</p>
            </div>
          </div>
          <Inventory books={(data.books || []).slice(0, 6)} />
        </div>
        <div className="[padding:24px] [background:rgb(255_255_255_/_91%)] [border:1px_solid_#eeedfa] [margin-bottom:17px] [border-radius:22px] [box-shadow:0_12px_30px_rgb(58_53_113_/_6%)] [margin:0] max-[760px]:[padding:17px] max-[760px]:[border-radius:18px]">
          <div className="[display:flex] [justify-content:space-between] [align-items:center] [margin-bottom:15px]">
            <div>
              <h3 className="font-display text-lg font-extrabold leading-snug tracking-[-.02em] text-[#29294f]">Recent orders</h3>
              <p className="text-[13px] leading-6 text-[#74758f]">Track each order and update its delivery progress.</p>
            </div>
          </div>
          <DeliveryTable
            rows={(data.deliveries || []).slice(0, 5)}
            librarian
            onUpdate={onUpdate}
          />
        </div>
        <div className="[padding:24px] [background:rgb(255_255_255_/_91%)] [border:1px_solid_#eeedfa] [margin-bottom:17px] [border-radius:22px] [box-shadow:0_12px_30px_rgb(58_53_113_/_6%)] [margin:0] max-[760px]:[padding:17px] max-[760px]:[border-radius:18px]">
          <div className="[display:flex] [justify-content:space-between] [align-items:center] [margin-bottom:15px]">
            <div>
              <h3 className="font-display text-lg font-extrabold leading-snug tracking-[-.02em] text-[#29294f]">Orders you placed</h3>
              <p className="text-[13px] leading-6 text-[#74758f]">Your customer orders and delivery progress.</p>
            </div>
          </div>
          <DeliveryTable rows={(data.customerOrders || []).slice(0, 5)} />
        </div>
        <div className="[position:relative] [background:rgb(255_255_255_/_91%)] [padding:22px_25px_20px_60px] [color:#5b4be8] [border:1px_solid_#eeedfa] [border-radius:22px] [box-shadow:0_12px_30px_rgb(58_53_113_/_6%)] max-[760px]:[padding:18px_17px_18px_50px]">
          <span>✳</span>
          <p className="text-[13px] leading-6 text-[#74758f]">A book is a gift you can open again and again.</p>
          <small>— GARRISON KEILLOR</small>
        </div>
      </>
    );
  const pie = (data.byCategory || []).map((c) => ({
    name: c._id,
    value: c.value,
  }));
  const colors = [
    "#244c3b",
    "#ce6d4f",
    "#b9ab78",
    "#7a8c74",
    "#a88baa",
    "#d4a47c",
  ];
  return (
    <>
      <div className="[display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:14px] [margin-bottom:21px] max-[1000px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[760px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[760px]:[gap:9px]">
        <Stat
          icon={<CircleUserRound />}
          label="Community members"
          value={data.users || 0}
          tone="mint"
        />
        <Stat
          icon={<BookOpen />}
          label="Books in the network"
          value={data.books || 0}
          tone="peach"
        />
        <Stat
          icon={<PackageCheck />}
          label="Completed requests"
          value={data.deliveryCount || 0}
          tone="lavender"
        />
        <Stat
          icon={<Shield />}
          label="Delivery revenue"
          value={money(data.revenue)}
          tone="sand"
        />
      </div>
      <div className="[padding:24px] [background:rgb(255_255_255_/_91%)] [border:1px_solid_#eeedfa] [margin-bottom:17px] [border-radius:22px] [box-shadow:0_12px_30px_rgb(58_53_113_/_6%)] [margin:0] max-[760px]:[padding:17px] max-[760px]:[border-radius:18px] [min-height:330px]">
        <div className="[display:flex] [justify-content:space-between] [align-items:center] [margin-bottom:15px]">
          <div>
            <h3 className="font-display text-lg font-extrabold leading-snug tracking-[-.02em] text-[#29294f]">The shape of the shelves</h3>
            <p className="text-[13px] leading-6 text-[#74758f]">Listings by category across BiblioDrop.</p>
          </div>
        </div>
        {pie.length ? (
          <div className="[display:grid] [grid-template-columns:1fr_1fr] [align-items:center] max-[760px]:[grid-template-columns:1fr]">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {pie.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="[display:flex] [flex-direction:column] [gap:12px] max-[760px]:[display:grid] max-[760px]:[grid-template-columns:1fr_1fr] max-[760px]:[padding:0_10px_15px]">
              {pie.map((p, i) => (
                <span key={p.name}>
                  <i
                    style={{
                      background: colors[i % colors.length],
                    }}
                  />
                  {p.name}
                  <b>{p.value}</b>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p
            className={`${"[font-size:10px] [color:#8b9188] [line-height:1.7]"}`}
          >
            Category insights appear as the collection grows.
          </p>
        )}
      </div>
    </>
  );
}
function Stat({ icon, label, value, tone }) {
  return (
    <article className="[background:rgb(255_255_255_/_91%)] [padding:19px] [min-height:145px] [border:1px_solid_#eeedfa] [display:flex] [flex-direction:column] [align-items:flex-start] [border-radius:22px] [box-shadow:0_12px_30px_rgb(58_53_113_/_6%)] [position:relative] [overflow:hidden] max-[760px]:[min-height:118px] max-[760px]:[padding:13px] max-[760px]:[border-radius:18px]">
      <span
        className={`[width:30px] [height:30px] [display:grid] [place-items:center] [border-radius:13px] [margin-bottom:13px]${inlineUtilities.tones[tone] || ""}`}
      >
        {icon}
      </span>
      <small>{label}</small>
      <strong>{value}</strong>
    </article>
  );
}
function OrderProgress({ status }) {
  const steps = [
    ["pending", "Confirmed"],
    ["processing", "In progress"],
    ["dispatched", "Dispatched"],
    ["in_transit", "On the way"],
    ["delivered", "Delivered"],
  ];
  const current = steps.findIndex((s) => s[0] === status);
  const percent = (Math.max(0, current) / (steps.length - 1)) * 100;
  const activeLabel =
    status === "returned" ? "Returned" : steps[Math.max(current, 0)][1];
  return (
    <div className="my-2.5 min-w-[280px] rounded-2xl bg-[#f8f8ff] px-4 py-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold text-[#777993]">Delivery progress</span>
        <b className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${status === "returned" ? "bg-[#fff0f3] text-[#bd506b]" : status === "delivered" ? "bg-[#e2f7ef] text-[#25866e]" : "bg-[#ece9ff] text-[#5b4be8]"}`}>{activeLabel}</b>
      </div>
      {status === "returned" ? (
        <p className="rounded-xl bg-white px-3 py-2 text-[11px] leading-5 text-[#777993]">This order was returned.</p>
      ) : (
        <div className="relative grid grid-cols-5 gap-1" role="progressbar" aria-label={`Order status: ${activeLabel}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(percent)}>
          <div className="absolute left-[10%] right-[10%] top-[11px] h-1 rounded-full bg-[#e6e4f3]" />
          <div className="absolute left-[10%] top-[11px] h-1 rounded-full bg-gradient-to-r from-[#7868f4] to-[#ff7c9b] transition-all" style={{ width: `${percent * 0.8}%` }} />
          {steps.map(([key, label], i) => {
            const done = i <= current;
            return <div className="relative z-10 flex flex-col items-center gap-1.5 text-center" key={key}>
              <i className={`grid h-[23px] w-[23px] place-items-center rounded-full border-2 text-[9px] not-italic ${done ? "border-[#7868f4] bg-[#7868f4] font-bold text-white" : "border-[#dedbed] bg-white text-[#9998af]"}`}>{i < current ? "✓" : i + 1}</i>
              <span className={`text-[8px] leading-3 ${i === current ? "font-bold text-[#5143d2]" : "text-[#9696ad]"}`}>{label}</span>
            </div>;
          })}
        </div>
      )}
    </div>
  );
}
function DeliveryTable({
  rows = [],
  librarian = false,
  admin = false,
  compact = false,
  onUpdate,
}) {
  const [query, setQuery] = useState(""),
    [editing, setEditing] = useState(null),
    [trackingNumber, setTrackingNumber] = useState(""),
    [trackingNote, setTrackingNote] = useState(""),
    [status, setStatus] = useState("");
  const filtered = rows.filter((d) =>
    `${d.orderNumber || ""} ${d.reader?.name || ""} ${d.reader?.email || ""} ${d.book?.title || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const open = (d) => {
    setEditing(d);
    setTrackingNumber(
      d.trackingNumber || (d.orderNumber ? "TRK-" + d.orderNumber : ""),
    );
    setTrackingNote(d.trackingNote || "");
    setStatus(
      {
        pending: "processing",
        processing: "dispatched",
        dispatched: "in_transit",
        in_transit: "delivered",
        delivered: "returned",
      }[d.status] || "",
    );
  };
  const save = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/deliveries/${editing._id}/status`, {
        status,
        trackingNumber,
        trackingNote,
      });
      toast.success("Order tracking updated.");
      setEditing(null);
      onUpdate?.();
    } catch (e) {
      toast.error(errorText(e));
    }
  };
  if (!rows.length)
    return (
      <EmptyState
        title="No orders here yet"
        copy="Paid book orders and their tracking will appear here."
      />
    );
  return (
    <>
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#e8e8f4] bg-white px-4 py-3 text-[#81839c] shadow-[0_4px_14px_rgba(45,65,48,.035)]">
        <Search className="shrink-0" size={18} />
        <input
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#29294f] outline-none placeholder:text-[#a0a1b6]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order number, reader or book"
        />
        <span className="shrink-0 rounded-full bg-[#f4f2ff] px-3 py-1 text-xs font-semibold text-[#6963b1]">{filtered.length} orders</span>
      </div>
      {!filtered.length ? (
        <EmptyState
          title="No matching orders"
          copy="Check the order number or search term."
        />
      ) : (
        <div className="w-full max-w-full overflow-x-auto overscroll-x-contain rounded-[20px] border border-[#ecebfa] bg-white shadow-[0_10px_24px_rgba(58,53,113,.06)]">
          <table
            className={`w-full ${admin ? "min-w-[1450px]" : "min-w-[1120px]"} table-fixed border-collapse text-left text-[13px] text-[#494a68]`}
          >
            <thead className="bg-[#f8f7ff] text-[11px] font-bold uppercase tracking-[.08em] text-[#777794]">
              <tr className="border-b border-[#ecebfa]">
                <th className={`${admin ? "w-[12%]" : "w-[13%]"} px-4 py-4`}>Book</th>
                <th className={`${admin ? "w-[12%]" : "w-[13%]"} px-4 py-4`}>{librarian ? "Reader" : "Ordered"}</th>
                {admin && <th className="w-[9%] px-4 py-4">Date</th>}
                <th className={`${admin ? "w-[8%]" : "w-[10%]"} px-4 py-4`}>City</th>
                <th className={`${admin ? "w-[13%]" : "w-[15%]"} px-4 py-4`}>Tracking number</th>
                <th className={`${admin ? "w-[7%]" : "w-[9%]"} px-4 py-4`}>Fee</th>
                {admin && <th className="w-[10%] px-4 py-4">Payment status</th>}
                <th className={`${admin ? "w-[19%]" : ""} px-4 py-4`}>{admin ? "Process" : "Tracking progress"}</th>
                {librarian && <th className={`${admin ? "w-[10%]" : "w-[12%]"} px-4 py-4`}>Update</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr className="border-b border-[#f0eff8] align-top transition-colors last:border-0 hover:bg-[#fcfbff]" key={d._id}>
                  <td className="px-4 py-4 font-semibold text-[#29294f]">
                    <b className="block leading-5">{d.book?.title || "Book"}</b>
                    {librarian && (
                      <small className="mt-1 block break-words text-[10px] font-normal leading-4 text-[#898aa1]">
                        {d.reader?.name} · {d.reader?.email}
                      </small>
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs leading-5">
                    {librarian
                      ? d.reader?.email
                      : new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  {admin && (
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-[#777993]">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                  )}
                  <td
                    className="max-w-[145px] break-words px-4 py-4 text-xs"
                  >
                    {d.city || "—"}
                  </td>
                  <td
                    className="break-all px-4 py-4 text-[11px] font-bold text-[#4f4e81]"
                  >
                    {d.trackingNumber ||
                      (d.orderNumber ? (
                        `TRK-${d.orderNumber}`
                      ) : (
                        <span className="[font-size:10px] [font-weight:500] [color:#929b93]">
                          Not assigned
                        </span>
                      ))}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-[#29294f]">{money(d.amount)}</td>
                  {admin && (
                    <td className="px-4 py-4">
                      <StatusBadge status={d.paymentStatus || "paid"} />
                    </td>
                  )}
                  <td className="min-w-0 px-4 py-3">
                    <OrderProgress status={d.status} />
                    {d.status === "returned" && (
                      <StatusBadge status="returned" />
                    )}
                    {!!d.trackingEvents?.length && (
                      <div className="mt-2 grid grid-cols-2 gap-2 max-[760px]:grid-cols-1">
                        {d.trackingEvents.slice(-2).map((event, i) => (
                          <small className="min-w-0 rounded-lg bg-[#f8f8fc] px-2.5 py-2 text-[10px] leading-4 text-[#777993]" key={i}>
                            {new Date(event.createdAt).toLocaleDateString()} ·{" "}
                            {event.note || event.status}
                          </small>
                        ))}
                      </div>
                    )}
                  </td>
                  {librarian && (
                    <td className="px-4 py-4">
                      {d.status !== "returned" && (
                        <button
                          className={`${"[display:inline-flex] [align-items:center] [gap:4px] [border:0] [background:none] [color:#5b4be8] [font-size:8px] [font-weight:700] [padding:5px] [margin:0] [white-space:nowrap] [border-radius:7px] [transition:background_0.15s_ease,_color_0.15s_ease,_transform_0.15s_ease] max-[760px]:[font-size:9px] hover:[background:#edf4ed] hover:[color:#28583e] hover:[transform:translateY(-1px)]"}`}
                          onClick={() => open(d)}
                        >
                          {d.status === "pending"
                            ? "Start processing"
                            : d.status === "processing"
                              ? "Dispatch"
                              : d.status === "dispatched"
                                ? "Mark on the way"
                                : d.status === "in_transit"
                                  ? "Confirm delivery"
                                  : "Close order"}{" "}
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <div
          className="[position:fixed] [z-index:50] [inset:0] [background:rgb(41_37_91_/_56%)] [display:grid] [place-items:center] [padding:20px] [overflow:auto] [backdrop-filter:blur(8px)]"
          onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <form
          className="relative grid max-h-[90vh] w-full max-w-[560px] gap-5 overflow-y-auto rounded-[28px] border border-white/80 bg-white p-8 shadow-[0_28px_80px_rgba(28,26,69,.25)] max-[760px]:gap-4 max-[760px]:rounded-[24px] max-[760px]:p-5"
            onSubmit={save}
          >
            <button
              type="button"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border-0 bg-[#f4f2ff] p-2 text-[#5b4be8] transition hover:bg-[#eae6ff]"
              onClick={() => setEditing(null)}
            >
              <X />
            </button>
            <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
              <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />{" "}
              UPDATE DELIVERY
            </div>
            <h2 className="font-display text-[clamp(24px,2.5vw,34px)] font-extrabold leading-tight tracking-[-.04em] text-[#29294f]">{editing.orderNumber || "Order tracking"}</h2>
            <OrderProgress status={editing.status} />
            <label className="flex flex-col gap-2 text-xs font-bold text-[#555673]">
              Next delivery step
              <select
                className="w-full rounded-xl border border-[#e4e3f0] bg-[#fcfcff] px-3.5 py-3 text-sm font-medium text-[#29294f] outline-none transition focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value={status}>
                  {
                    {
                      processing: "In progress",
                      dispatched: "Dispatched",
                      in_transit: "On the way",
                      delivered: "Delivery confirmed",
                      returned: "Returned / closed",
                    }[status]
                  }
                </option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-xs font-bold text-[#555673]">
              Tracking number
              <input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                maxLength={100}
                placeholder="Optional carrier reference"
                className="w-full rounded-xl border border-[#e4e3f0] bg-[#fcfcff] px-3.5 py-3 text-sm font-medium text-[#29294f] outline-none transition placeholder:font-normal placeholder:text-[#a0a1b6] focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
              />
            </label>
            <label className="flex flex-col gap-2 text-xs font-bold text-[#555673]">
              Update note
              <textarea
                value={trackingNote}
                onChange={(e) => setTrackingNote(e.target.value)}
                maxLength={500}
                placeholder="For example, reached local delivery hub"
                className="min-h-24 w-full resize-y rounded-xl border border-[#e4e3f0] bg-[#fcfcff] px-3.5 py-3 text-sm font-medium text-[#29294f] outline-none transition placeholder:font-normal placeholder:text-[#a0a1b6] focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
              />
            </label>
            <div className="mt-1 flex flex-wrap justify-end gap-3 max-[520px]:flex-col-reverse">
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#e2def8] bg-white px-6 text-sm font-extrabold text-[#5b4be8] shadow-sm transition hover:bg-[#f8f7ff] max-[520px]:w-full"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7d6df6] to-[#5545de] px-6 text-sm font-extrabold text-white shadow-[0_9px_20px_rgba(91,75,232,.24)] transition hover:-translate-y-0.5 hover:saturate-125 max-[520px]:w-full"
              >
                Save delivery update <ArrowRight size={15} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
function Inventory({ books = [], onRefresh }) {
  return books.length ? (
    <div className="[width:100%] [overflow-x:auto] [border:1px_solid_#eeedfa] [border-radius:19px] [background:white] [box-shadow:0_10px_24px_rgb(58_53_113_/_5%)] [overflow:auto] max-[760px]:[margin:0_-4px] max-[760px]:[width:calc(100%_+_8px)] max-[760px]:[border-radius:11px]">
      <table>
        <thead>
          <tr>
            <th>Book</th>
            <th>Category</th>
            <th>Delivery fee</th>
            <th>Listing status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b._id}>
              <td>
                <div className="[display:flex] [align-items:center] [gap:9px] [min-width:145px]">
                  <img className="h-16 w-12 shrink-0 rounded-lg object-cover shadow-sm" src={b.coverUrl || coverFallback} alt={`Cover of ${b.title}`} />
                  <span>
                    <b>{b.title}</b>
                    <small>{b.author}</small>
                  </span>
                </div>
              </td>
              <td>{b.category}</td>
              <td>{money(b.deliveryFee)}</td>
              <td>
                <StatusBadge
                  status={
                    b.approval === "pending"
                      ? "pending approval"
                      : b.published
                        ? "published"
                        : "unpublished"
                  }
                />
              </td>
              <td>
                {b.approval === "approved" && (
                  <button
                    className={`${"[display:inline-flex] [align-items:center] [gap:4px] [border:0] [background:none] [color:#5b4be8] [font-size:8px] [font-weight:700] [padding:5px] [margin:0] [white-space:nowrap] [border-radius:7px] [transition:background_0.15s_ease,_color_0.15s_ease,_transform_0.15s_ease] max-[760px]:[font-size:9px] hover:[background:#edf4ed] hover:[color:#28583e] hover:[transform:translateY(-1px)]"}`}
                    onClick={async () => {
                      try {
                        await api.patch(`/books/${b._id}/publish`);
                        toast.success(
                          b.published ? "Book unpublished." : "Book published.",
                        );
                        onRefresh?.();
                      } catch (e) {
                        toast.error(errorText(e));
                      }
                    }}
                  >
                    {b.published ? "Unpublish" : "Publish"}{" "}
                    <ArrowRight size={13} />
                  </button>
                )}
                <button
                  className={`${"[display:inline-flex] [align-items:center] [gap:4px] [border:0] [background:none] [color:#5b4be8] [font-size:8px] [font-weight:700] [padding:5px] [margin:0] [white-space:nowrap] [border-radius:7px] [transition:background_0.15s_ease,_color_0.15s_ease,_transform_0.15s_ease] max-[760px]:[font-size:9px] hover:[background:#edf4ed] hover:[color:#28583e] hover:[transform:translateY(-1px)] [color:#a65c49]"}`}
                  onClick={async () => {
                    if (
                      !window.confirm(
                        `Remove “${b.title}” from your inventory?`,
                      )
                    )
                      return;
                    try {
                      await api.delete(`/books/${b._id}`);
                      toast.success("Book removed.");
                      onRefresh?.();
                    } catch (e) {
                      toast.error(errorText(e));
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyState
      title="Your shelves are waiting"
      copy="Add a book to get your local library started."
    />
  );
}
function LibrarianInventory({ books = [], onRefresh }) {
  const [addCounts, setAddCounts] = useState({}),
    [busy, setBusy] = useState("");
  const available = (b) =>
    Number(b.quantity ?? (b.availability === "checked_out" ? 0 : 1));
  const addCopies = async (b) => {
    const count = Number(addCounts[b._id] || 0);
    if (!Number.isInteger(count) || count < 1)
      return toast.error("Enter how many copies to add.");
    setBusy(b._id);
    try {
      await api.patch(`/books/${b._id}/quantity`, {
        quantity: available(b) + count,
      });
      toast.success(
        `${count} ${count === 1 ? "copy" : "copies"} added to your inventory.`,
      );
      setAddCounts((v) => ({
        ...v,
        [b._id]: "",
      }));
      onRefresh?.();
    } catch (e) {
      toast.error(errorText(e));
    } finally {
      setBusy("");
    }
  };
  return books.length ? (
    <>
      <div className="[display:flex] [flex-wrap:wrap] [gap:12px] [margin-bottom:16px]">
        <span>
          <b>{books.length}</b> book listings
        </span>
        <span>
          <b>{books.reduce((sum, b) => sum + available(b), 0)}</b> available
          copies
        </span>
        <span>
          <b>{books.filter((b) => available(b) === 0).length}</b> out of stock
        </span>
      </div>
      <div className="w-full overflow-x-auto rounded-[19px] border border-[#eeedfa] bg-white shadow-[0_10px_24px_rgb(58_53_113_/_5%)] max-[760px]:rounded-xl">
        <table className="w-full min-w-[850px] table-fixed border-collapse text-left text-[13px] text-[#494a68]">
          <thead className="bg-[#f8f7ff] text-[11px] font-bold uppercase tracking-[.06em] text-[#777794]">
            <tr className="border-b border-[#ecebfa]">
              <th className="w-[26%] px-5 py-4">Book</th>
              <th className="w-[13%] px-5 py-4">Current stock</th>
              <th className="w-[14%] px-5 py-4">Availability</th>
              <th className="w-[21%] px-5 py-4">Add copies</th>
              <th className="w-[14%] px-5 py-4">Listing</th>
              <th className="w-[12%] px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr className="border-b border-[#f0eff8] align-middle last:border-0 hover:bg-[#fcfbff]" key={b._id}>
                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <img className="h-16 w-12 shrink-0 rounded-lg object-cover shadow-sm" src={b.coverUrl || coverFallback} alt={`Cover of ${b.title}`} />
                    <span className="min-w-0">
                      <b className="block truncate font-semibold text-[#29294f]">{b.title}</b>
                      <small className="mt-1 block truncate text-xs text-[#85869f]">{b.author}</small>
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <b className="text-sm font-semibold text-[#365944]">
                    {available(b)} copies
                  </b>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge
                    status={available(b) > 0 ? "in stock" : "out of stock"}
                  />
                </td>
                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <input
                      className="h-10 w-28 shrink-0 rounded-lg border border-[#deddf0] bg-white px-3 text-sm text-[#29294f] outline-none transition placeholder:text-[#a4a3ba] focus:border-[#7969f2] focus:ring-4 focus:ring-[#7969f2]/10"
                      aria-label={`Copies to add for ${b.title}`}
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Quantity"
                      value={addCounts[b._id] ?? ""}
                      onChange={(e) =>
                        setAddCounts((v) => ({
                          ...v,
                          [b._id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="inline-flex min-h-9 items-center justify-center rounded-lg bg-[#f0edff] px-3 text-xs font-bold text-[#5b4be8] transition hover:-translate-y-0.5 hover:bg-[#e5e1ff] disabled:cursor-wait disabled:opacity-60"
                      disabled={busy === b._id}
                      onClick={() => addCopies(b)}
                    >
                      {busy === b._id ? "Adding…" : "Add copies"}
                    </button>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge
                    status={
                      b.approval === "pending"
                        ? "pending approval"
                        : b.published
                          ? "published"
                          : "unpublished"
                    }
                  />
                </td>
                <td className="px-5 py-4">
                  {b.approval === "approved" && (
                    <button
                      className={`${"[display:inline-flex] [align-items:center] [gap:4px] [border:0] [background:none] [color:#5b4be8] [font-size:8px] [font-weight:700] [padding:5px] [margin:0] [white-space:nowrap] [border-radius:7px] [transition:background_0.15s_ease,_color_0.15s_ease,_transform_0.15s_ease] max-[760px]:[font-size:9px] hover:[background:#edf4ed] hover:[color:#28583e] hover:[transform:translateY(-1px)]"}`}
                      onClick={async () => {
                        try {
                          await api.patch(`/books/${b._id}/publish`);
                          toast.success(
                            b.published
                              ? "Book unpublished."
                              : "Book published.",
                          );
                          onRefresh?.();
                        } catch (e) {
                          toast.error(errorText(e));
                        }
                      }}
                    >
                      {b.published ? "Unpublish" : "Publish"}
                    </button>
                  )}
                  <button
                    className={`${"[display:inline-flex] [align-items:center] [gap:4px] [border:0] [background:none] [color:#5b4be8] [font-size:8px] [font-weight:700] [padding:5px] [margin:0] [white-space:nowrap] [border-radius:7px] [transition:background_0.15s_ease,_color_0.15s_ease,_transform_0.15s_ease] max-[760px]:[font-size:9px] hover:[background:#edf4ed] hover:[color:#28583e] hover:[transform:translateY(-1px)] [color:#a65c49]"}`}
                    onClick={async () => {
                      if (
                        !window.confirm(
                          `Remove “${b.title}” from your inventory?`,
                        )
                      )
                        return;
                      try {
                        await api.delete(`/books/${b._id}`);
                        toast.success("Book removed.");
                        onRefresh?.();
                      } catch (e) {
                        toast.error(errorText(e));
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <EmptyState
      title="Your shelves are waiting"
      copy="Add a book to get your local library started."
    />
  );
}
function MyReviews({ reviews = [] }) {
  const [items, setItems] = useState(reviews);
  useEffect(() => setItems(reviews), [reviews]);
  const edit = async (r) => {
    const comment = window.prompt("Update your review", r.comment);
    if (comment === null || comment.trim().length < 5) return;
    try {
      await api.patch(`/reviews/${r._id}`, {
        rating: r.rating,
        comment: comment.trim(),
      });
      setItems((v) =>
        v.map((x) =>
          x._id === r._id
            ? {
                ...x,
                comment: comment.trim(),
              }
            : x,
        ),
      );
      toast.success("Review updated.");
    } catch (e) {
      toast.error(errorText(e));
    }
  };
  const remove = async (r) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${r._id}`);
      setItems((v) => v.filter((x) => x._id !== r._id));
      toast.success("Review deleted.");
    } catch (e) {
      toast.error(errorText(e));
    }
  };
  return items.length ? (
    <div className="[display:flex] [flex-direction:column] [gap:13px] [max-width:750px]">
      {items.map((r) => (
        <article className="[padding:18px] [background:#efeee7]" key={r._id}>
          <div className="[display:flex] [align-items:center] [gap:10px]">
            <div>
              <b>{r.book?.title || "Book"}</b>
              <small>{new Date(r.createdAt).toLocaleDateString()}</small>
            </div>
            <span className="[margin-left:auto] [color:#b48643] [font-size:10px] [letter-spacing:1px]">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </span>
          </div>
          <p className="text-[13px] leading-6 text-[#74758f]">{r.comment}</p>
          <div className="">
            <button
              className={`${"[display:inline-flex] [align-items:center] [gap:4px] [border:0] [background:none] [color:#5b4be8] [font-size:8px] [font-weight:700] [padding:5px] [margin:0] [white-space:nowrap] [border-radius:7px] [transition:background_0.15s_ease,_color_0.15s_ease,_transform_0.15s_ease] max-[760px]:[font-size:9px] hover:[background:#edf4ed] hover:[color:#28583e] hover:[transform:translateY(-1px)]"}`}
              onClick={() => edit(r)}
            >
              Edit review
            </button>
            <button
              className={`${"[display:inline-flex] [align-items:center] [gap:4px] [border:0] [background:none] [color:#5b4be8] [font-size:8px] [font-weight:700] [padding:5px] [margin:0] [white-space:nowrap] [border-radius:7px] [transition:background_0.15s_ease,_color_0.15s_ease,_transform_0.15s_ease] max-[760px]:[font-size:9px] hover:[background:#edf4ed] hover:[color:#28583e] hover:[transform:translateY(-1px)] [color:#a65c49]"}`}
              onClick={() => remove(r)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  ) : (
    <EmptyState
      title="No reviews yet"
      copy="Once a delivery is complete, come back to share what you thought."
    />
  );
}
function ReadingList({ rows = [] }) {
  const books = rows.filter((r) =>
    ["delivered", "returned"].includes(r.status),
  );
  return books.length ? (
    <div className="[display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:28px_22px] max-[760px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[760px]:[gap:24px_13px] [grid-template-columns:repeat(4,_minmax(0,_1fr))] max-[760px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]">
      {books.map(
        (d, i) =>
          d.book && (
            <BookCard
              key={d._id}
              book={{
                ...d.book,
                category: "Your reading list",
                deliveryFee: d.amount,
                availability: "checked_out",
              }}
              index={i}
            />
          ),
      )}
    </div>
  ) : (
    <EmptyState
      title="Your reading list is ready"
      copy="Books appear here once a librarian marks your delivery complete."
    />
  );
}
function AdminApprovals({ books, onRefresh }) {
  const pending = books.filter((b) => b.approval === "pending");
  return pending.length ? (
    <div className="[width:100%] [overflow-x:auto] [border:1px_solid_#eeedfa] [border-radius:19px] [background:white] [box-shadow:0_10px_24px_rgb(58_53_113_/_5%)] [overflow:auto] max-[760px]:[margin:0_-4px] max-[760px]:[width:calc(100%_+_8px)] max-[760px]:[border-radius:11px]">
      <table>
        <thead>
          <tr>
            <th>Book</th>
            <th>Librarian</th>
            <th>Category</th>
            <th>Fee</th>
            <th>Decision</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((b) => (
            <tr key={b._id}>
              <td>
                <div className="[display:flex] [align-items:center] [gap:9px] [min-width:145px]">
                  <img className="h-16 w-12 shrink-0 rounded-lg object-cover shadow-sm" src={b.coverUrl || coverFallback} alt={`Cover of ${b.title}`} />
                  <span>
                    <b>{b.title}</b>
                    <small>{b.author}</small>
                  </span>
                </div>
              </td>
              <td>
                {b.owner?.name}
                <small>{b.owner?.email}</small>
              </td>
              <td>{b.category}</td>
              <td>{money(b.deliveryFee)}</td>
              <td>
                <button
                  className={`${"[display:inline-flex] [align-items:center] [gap:4px] [border:0] [background:none] [color:#5b4be8] [font-size:8px] [font-weight:700] [padding:5px] [margin:0] [white-space:nowrap] [border-radius:7px] [transition:background_0.15s_ease,_color_0.15s_ease,_transform_0.15s_ease] max-[760px]:[font-size:9px] hover:[background:#edf4ed] hover:[color:#28583e] hover:[transform:translateY(-1px)]"}`}
                  onClick={async () => {
                    try {
                      await api.post(`/admin/books/${b._id}/approve`);
                      toast.success("Book approved and published.");
                      onRefresh();
                    } catch (e) {
                      toast.error(errorText(e));
                    }
                  }}
                >
                  Approve <Check size={13} />
                </button>
                <button
                  className={`${"[display:inline-flex] [align-items:center] [gap:4px] [border:0] [background:none] [color:#5b4be8] [font-size:8px] [font-weight:700] [padding:5px] [margin:0] [white-space:nowrap] [border-radius:7px] [transition:background_0.15s_ease,_color_0.15s_ease,_transform_0.15s_ease] max-[760px]:[font-size:9px] hover:[background:#edf4ed] hover:[color:#28583e] hover:[transform:translateY(-1px)] [color:#a65c49]"}`}
                  onClick={async () => {
                    try {
                      await api.delete(`/books/${b._id}`);
                      toast.success("Listing removed.");
                      onRefresh();
                    } catch (e) {
                      toast.error(errorText(e));
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyState
      title="All caught up"
      copy="There are no books waiting for approval."
    />
  );
}
function AdminInventory({ books = [], onRefresh }) {
  const [addCounts, setAddCounts] = useState({}),
    [busy, setBusy] = useState(""),
    [query, setQuery] = useState(""),
    [stockFilter, setStockFilter] = useState("all");
  const available = (b) =>
    Number(b.quantity ?? (b.availability === "checked_out" ? 0 : 1));
  const addCopies = async (b) => {
    const added = Number(addCounts[b._id] || 0);
    if (!Number.isInteger(added) || added < 1)
      return toast.error("Enter how many copies to add.");
    setBusy(b._id);
    try {
      await api.patch(`/admin/books/${b._id}/quantity`, {
        quantity: available(b) + added,
      });
      toast.success(
        `${added} ${added === 1 ? "copy" : "copies"} added to inventory.`,
      );
      setAddCounts((v) => ({
        ...v,
        [b._id]: "",
      }));
      onRefresh();
    } catch (e) {
      toast.error(errorText(e));
    } finally {
      setBusy("");
    }
  };
  const total = books.reduce((sum, b) => sum + available(b), 0);
  const visible = books.filter(
    (b) =>
      (
        String(b.title) +
        " " +
        String(b.author) +
        " " +
        String(b.owner?.name || "")
      )
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (stockFilter === "all" ||
        (stockFilter === "out" ? available(b) === 0 : available(b) > 0)),
  );
  return books.length ? (
    <>
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e9e7fb] bg-white px-4 py-3.5 shadow-[0_6px_18px_rgba(58,53,113,.04)]">
          <span className="block text-xs font-semibold text-[#85869f]">Book listings</span>
          <b className="mt-1 block font-display text-2xl font-extrabold text-[#29294f]">{books.length}</b>
        </div>
        <div className="rounded-2xl border border-[#e4f0e8] bg-[#fbfffc] px-4 py-3.5 shadow-[0_6px_18px_rgba(58,53,113,.04)]">
          <span className="block text-xs font-semibold text-[#718778]">Available copies</span>
          <b className="mt-1 block font-display text-2xl font-extrabold text-[#365944]">{total}</b>
        </div>
        <div className="rounded-2xl border border-[#f4e8e9] bg-[#fffdfd] px-4 py-3.5 shadow-[0_6px_18px_rgba(58,53,113,.04)]">
          <span className="block text-xs font-semibold text-[#9a777d]">Out of stock</span>
          <b className="mt-1 block font-display text-2xl font-extrabold text-[#a65c70]">{books.filter((b) => available(b) === 0).length}</b>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-2xl border border-[#e8e8f4] bg-white p-3 text-[#79847c] shadow-[0_4px_14px_rgba(45,65,48,.035)] max-[760px]:grid-cols-[minmax(0,1fr)_auto]">
        <label className="flex h-11 min-w-0 items-center gap-2.5 rounded-xl border border-[#e8e7f1] bg-[#fcfbff] px-3.5 text-[#85869f] transition focus-within:border-[#7969f2] focus-within:ring-4 focus-within:ring-[#7969f2]/10 max-[760px]:col-span-2">
          <Search className="shrink-0" size={17} />
          <input
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-[#29294f] outline-none placeholder:text-[#a4a3ba]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by book, author or librarian"
          />
        </label>
        <select
          className="h-11 min-w-[130px] rounded-xl border border-[#e8e7f1] bg-white px-3 text-sm font-semibold text-[#555673] outline-none focus:border-[#7969f2] focus:ring-4 focus:ring-[#7969f2]/10"
          aria-label="Filter inventory by stock"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="all">All stock</option>
          <option value="in">In stock</option>
          <option value="out">Out of stock</option>
        </select>
        <span className="justify-self-end rounded-full bg-[#f2f0ff] px-3 py-2 text-xs font-bold text-[#5b4be8]">
          {visible.length} books
        </span>
      </div>
      <div className="w-full overflow-x-auto rounded-[19px] border border-[#eeedfa] bg-white shadow-[0_10px_24px_rgb(58_53_113_/_5%)] max-[760px]:rounded-xl">
        <table className="w-full min-w-[850px] table-fixed border-collapse text-left text-[13px] text-[#494a68]">
          <thead className="bg-[#f8f7ff] text-[11px] font-bold uppercase tracking-[.06em] text-[#777794]">
            <tr className="border-b border-[#ecebfa]">
              <th className="w-[34%] px-5 py-4">Book</th>
              <th className="w-[16%] px-5 py-4">Current stock</th>
              <th className="w-[18%] px-5 py-4">Availability</th>
              <th className="w-[32%] px-5 py-4">Add copies</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((b) => (
              <tr className="border-b border-[#f0eff8] align-middle last:border-0 hover:bg-[#fcfbff]" key={b._id}>
                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <img className="h-16 w-12 shrink-0 rounded-lg object-cover shadow-sm" src={b.coverUrl || coverFallback} alt={`Cover of ${b.title}`} />
                    <span className="min-w-0">
                      <b className="block truncate font-semibold text-[#29294f]">{b.title}</b>
                      <small className="mt-1 block truncate text-xs text-[#85869f]">{b.author}</small>
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <b className="text-sm font-semibold text-[#365944]">
                    {available(b)} copies
                  </b>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge
                    status={available(b) > 0 ? "in stock" : "out of stock"}
                  />
                </td>
                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <input
                      className="h-10 w-28 shrink-0 rounded-lg border border-[#deddf0] bg-white px-3 text-sm text-[#29294f] outline-none transition placeholder:text-[#a4a3ba] focus:border-[#7969f2] focus:ring-4 focus:ring-[#7969f2]/10"
                      aria-label={`Copies to add for ${b.title}`}
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Quantity"
                      value={addCounts[b._id] ?? ""}
                      onChange={(e) =>
                        setAddCounts((v) => ({
                          ...v,
                          [b._id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="inline-flex min-h-9 items-center justify-center rounded-lg bg-[#f0edff] px-3 text-xs font-bold text-[#5b4be8] transition hover:-translate-y-0.5 hover:bg-[#e5e1ff] disabled:cursor-wait disabled:opacity-60"
                      disabled={busy === b._id}
                      onClick={() => addCopies(b)}
                    >
                      {busy === b._id ? "Adding…" : "Add to inventory"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <EmptyState
      title="No books to stock"
      copy="Add a book listing before adding copies to inventory."
    />
  );
}
function AdminBooks({ books, onRefresh }) {
  const [remove, setRemove] = useState(null),
    [busy, setBusy] = useState(false),
    [quantities, setQuantities] = useState({});
  const count = (b) => b.quantity ?? (b.availability === "checked_out" ? 0 : 1);
  const confirm = async () => {
    setBusy(true);
    try {
      await api.delete(`/books/${remove._id}`);
      toast.success("Book deleted.");
      setRemove(null);
      onRefresh();
    } catch (e) {
      toast.error(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  const saveQuantity = async (b) => {
    try {
      await api.patch(`/admin/books/${b._id}/quantity`, {
        quantity: Number(quantities[b._id] ?? count(b)),
      });
      toast.success("Inventory quantity updated.");
      onRefresh();
    } catch (e) {
      toast.error(errorText(e));
    }
  };
  return (
    <>
      <div className="w-full overflow-x-auto rounded-[20px] border border-[#ecebfa] bg-white shadow-[0_10px_24px_rgba(58,53,113,.06)]">
        <table className="w-full min-w-[1040px] table-fixed border-collapse text-left text-[13px] text-[#494a68]">
          <thead className="bg-[#f8f7ff] text-[11px] font-bold uppercase tracking-[.08em] text-[#777794]">
            <tr className="border-b border-[#ecebfa]">
              <th className="w-[24%] px-4 py-4">Book</th>
              <th className="w-[20%] px-4 py-4">Librarian</th>
              <th className="w-[20%] px-4 py-4">Available copies</th>
              <th className="w-[12%] px-4 py-4">Visibility</th>
              <th className="w-[14%] px-4 py-4">Listing approval</th>
              <th className="w-[10%] px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr className="border-b border-[#f0eff8] align-middle transition-colors last:border-0 hover:bg-[#fcfbff]" key={b._id}>
                <td className="px-4 py-3.5">
                  <div className="flex min-w-[180px] items-center gap-3">
                    <img className="h-16 w-12 shrink-0 rounded-lg object-cover shadow-sm" src={b.coverUrl || coverFallback} alt={`Cover of ${b.title}`} />
                    <span className="min-w-0">
                      <b className="block truncate font-semibold text-[#29294f]">{b.title}</b>
                      <small className="mt-1 block truncate text-xs text-[#85869f]">{b.author}</small>
                    </span>
                  </div>
                </td>
                <td className="break-words px-4 py-3.5 text-xs leading-5">
                  {b.owner?.name}
                  <small className="mt-1 block break-all text-[10px] text-[#85869f]">{b.owner?.email}</small>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <input
                      className="w-20 rounded-lg border border-[#e4e3f0] bg-white px-2.5 py-2 text-sm text-[#29294f] outline-none focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
                      aria-label={`Available copies for ${b.title}`}
                      type="number"
                      min="0"
                      step="1"
                      value={quantities[b._id] ?? count(b)}
                      onChange={(e) =>
                        setQuantities({
                          ...quantities,
                          [b._id]: e.target.value,
                        })
                      }
                    />
                    <button
                      className={`${"[display:inline-flex] [align-items:center] [gap:4px] [border:0] [background:none] [color:#5b4be8] [font-size:8px] [font-weight:700] [padding:5px] [margin:0] [white-space:nowrap] [border-radius:7px] [transition:background_0.15s_ease,_color_0.15s_ease,_transform_0.15s_ease] max-[760px]:[font-size:9px] hover:[background:#edf4ed] hover:[color:#28583e] hover:[transform:translateY(-1px)]"}`}
                      onClick={() => saveQuantity(b)}
                    >
                      Save
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge
                    status={b.published ? "published" : "unpublished"}
                  />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge
                    status={
                      b.approval === "pending" ? "pending approval" : "approved"
                    }
                  />
                </td>
                <td className="px-4 py-3.5">
                  {b.approval === "pending" && (
                    <button
                      className={`${"[display:inline-flex] [align-items:center] [gap:4px] [border:0] [background:none] [color:#5b4be8] [font-size:8px] [font-weight:700] [padding:5px] [margin:0] [white-space:nowrap] [border-radius:7px] [transition:background_0.15s_ease,_color_0.15s_ease,_transform_0.15s_ease] max-[760px]:[font-size:9px] hover:[background:#edf4ed] hover:[color:#28583e] hover:[transform:translateY(-1px)]"}`}
                      onClick={async () => {
                        try {
                          await api.post(`/admin/books/${b._id}/approve`);
                          toast.success("Approved.");
                          onRefresh();
                        } catch (e) {
                          toast.error(errorText(e));
                        }
                      }}
                    >
                      Approve
                    </button>
                  )}
                  {b.approval === "approved" && (
                    <button
                      className={`${"[display:inline-flex] [align-items:center] [gap:4px] [border:0] [background:none] [color:#5b4be8] [font-size:8px] [font-weight:700] [padding:5px] [margin:0] [white-space:nowrap] [border-radius:7px] [transition:background_0.15s_ease,_color_0.15s_ease,_transform_0.15s_ease] max-[760px]:[font-size:9px] hover:[background:#edf4ed] hover:[color:#28583e] hover:[transform:translateY(-1px)]"}`}
                      onClick={async () => {
                        try {
                          await api.patch(`/admin/books/${b._id}/visibility`, {
                            published: !b.published,
                          });
                          toast.success(
                            b.published
                              ? "Listing unpublished."
                              : "Listing published.",
                          );
                          onRefresh();
                        } catch (e) {
                          toast.error(errorText(e));
                        }
                      }}
                    >
                      {b.published ? "Unpublish" : "Publish"}
                    </button>
                  )}
                  <button
                    className={`${"[display:inline-flex] [align-items:center] [gap:4px] [border:0] [background:none] [color:#5b4be8] [font-size:8px] [font-weight:700] [padding:5px] [margin:0] [white-space:nowrap] [border-radius:7px] [transition:background_0.15s_ease,_color_0.15s_ease,_transform_0.15s_ease] max-[760px]:[font-size:9px] hover:[background:#edf4ed] hover:[color:#28583e] hover:[transform:translateY(-1px)] [color:#a65c49]"}`}
                    onClick={() => setRemove(b)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {remove && (
        <ConfirmModal
          title="Remove this book?"
          copy={`“${remove.title}” will be removed from the shelves.`}
          busy={busy}
          close={() => setRemove(null)}
          confirm={confirm}
        />
      )}
    </>
  );
}
function AdminUsers({ users, onRefresh }) {
  const [remove, setRemove] = useState(null),
    [busy, setBusy] = useState(false);
  const confirm = async () => {
    setBusy(true);
    try {
      await api.delete(`/admin/users/${remove.id}`);
      toast.success("Account removed.");
      setRemove(null);
      onRefresh();
    } catch (e) {
      toast.error(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <div className="w-full overflow-x-auto rounded-[20px] border border-[#ecebfa] bg-white shadow-[0_10px_24px_rgba(58,53,113,.06)]">
        <table className="w-full min-w-[760px] table-fixed border-collapse text-left text-[13px] text-[#494a68]">
          <thead className="bg-[#f8f7ff] text-[11px] font-bold uppercase tracking-[.08em] text-[#777794]">
            <tr className="border-b border-[#ecebfa]">
              <th className="w-[38%] px-5 py-4">Member</th>
              <th className="w-[25%] px-5 py-4">Joined</th>
              <th className="w-[15%] px-5 py-4">Role</th>
              <th className="w-[22%] px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr className="border-b border-[#f0eff8] transition-colors last:border-0 hover:bg-[#fcfbff]" key={u.id}>
                <td className="px-5 py-4">
                  <b className="block truncate font-semibold text-[#29294f]">{u.name}</b>
                  <small className="mt-1 block break-all text-xs text-[#85869f]">{u.email}</small>
                </td>
                <td className="px-5 py-4 text-xs text-[#777993]">Community member</td>
                <td className="px-5 py-4">
                  <StatusBadge status={u.role} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="min-w-[125px] rounded-xl border border-[#e4e3f0] bg-[#fcfcff] px-3 py-2.5 text-xs font-semibold text-[#494a68] outline-none focus:border-[#7868f4] focus:ring-4 focus:ring-[#7868f4]/10"
                    aria-label={`Change ${u.name} role`}
                    value={u.role}
                    onChange={async (e) => {
                      try {
                        await api.patch(`/admin/users/${u.id}/role`, {
                          role: e.target.value,
                        });
                        toast.success("Member role updated.");
                        onRefresh();
                      } catch (err) {
                        toast.error(errorText(err));
                      }
                    }}
                  >
                    <option value="user">Reader</option>
                    <option value="librarian">Librarian</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    className="rounded-lg px-3 py-2 text-xs font-bold text-[#ba5b72] transition hover:bg-[#fff0f3]"
                    onClick={() => setRemove(u)}
                  >
                    Delete
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {remove && (
        <ConfirmModal
          title="Remove this account?"
          copy={`${remove.email} will lose access to this account.`}
          busy={busy}
          close={() => setRemove(null)}
          confirm={confirm}
        />
      )}
    </>
  );
}
function ConfirmModal({ title, copy, busy, close, confirm }) {
  return (
    <div
      className="[position:fixed] [z-index:50] [inset:0] [background:rgb(41_37_91_/_56%)] [display:grid] [place-items:center] [padding:20px] [overflow:auto] [backdrop-filter:blur(8px)]"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className="[position:relative] [width:min(100%,_520px)] [max-height:90vh] [overflow:auto] [background:#fff] [border-radius:28px] [padding:34px] [box-shadow:0_28px_80px_rgb(28_26_69_/_25%)] [display:grid] [gap:17px] [border:1px_solid_rgb(255_255_255_/_75%)] max-[760px]:[padding:28px_19px]">
        <button
          type="button"
          className={`${"[position:absolute] [right:18px] [top:17px] [border:0] [background:transparent] [color:#5b4be8] [display:grid] [place-items:center] [padding:7px]"}`}
          onClick={close}
        >
          <X />
        </button>
        <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
          <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />{" "}
          CONFIRM ACTION
        </div>
        <h2 className="font-display text-[clamp(24px,2.5vw,34px)] font-extrabold leading-tight tracking-[-.04em] text-[#29294f]">{title}</h2>
        <p className="text-[13px] leading-6 text-[#74758f]">{copy}</p>
        <div className="[display:flex] [justify-content:flex-end] [gap:10px] [flex-wrap:wrap]">
          <button
            className={`${"[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:#fff] [border-color:#c8cec6] [color:#5545de] [border:1px_solid_#dcd9ff]"}`}
            onClick={close}
          >
            Cancel
          </button>
          <button
            className={`${"[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)]"}`}
            disabled={busy}
            onClick={confirm}
          >
            {busy ? "Removing…" : "Confirm removal"}
          </button>
        </div>
      </div>
    </div>
  );
}
function TransactionTable({ rows = [] }) {
  return rows.length ? (
    <div className="w-full overflow-x-auto rounded-[20px] border border-[#ecebfa] bg-white shadow-[0_10px_24px_rgba(58,53,113,.06)]">
      <table className="w-full min-w-[980px] table-fixed border-collapse text-left text-[13px] text-[#494a68]">
        <thead className="bg-[#f8f7ff] text-[11px] font-bold uppercase tracking-[.08em] text-[#777794]">
          <tr className="border-b border-[#ecebfa]">
            <th className="w-[18%] px-5 py-4">Book</th>
            <th className="w-[20%] px-5 py-4">Reader</th>
            <th className="w-[20%] px-5 py-4">Librarian</th>
            <th className="w-[9%] px-5 py-4">Amount</th>
            <th className="w-[10%] px-5 py-4">Date</th>
            <th className="w-[11%] px-5 py-4">Payment status</th>
            <th className="w-[12%] px-5 py-4">Process</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr className="border-b border-[#f0eff8] transition-colors last:border-0 hover:bg-[#fcfbff]" key={r._id}>
              <td className="break-words px-5 py-4 font-semibold text-[#29294f]">{r.book?.title || "Book"}</td>
              <td className="break-all px-5 py-4 text-xs">{r.reader?.email || "—"}</td>
              <td className="break-all px-5 py-4 text-xs">{r.librarian?.email || "—"}</td>
              <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#29294f]">{money(r.amount)}</td>
              <td className="whitespace-nowrap px-5 py-4 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
              <td className="px-5 py-4">
                <StatusBadge status={r.paymentStatus || "paid"} />
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyState
      title="No transactions yet"
      copy="Paid delivery requests will appear here."
    />
  );
}
function StatusBadge({ status }) {
  const cls = String(status).replaceAll(" ", "-").toLowerCase();
  return (
    <span
      className={`[display:inline-flex] [padding:5px_8px] [border-radius:999px] [background:#eaede7] [color:#687463] [font-size:8px] [text-transform:capitalize] [white-space:nowrap] [font-weight:800] [letter-spacing:0.01em]${inlineUtilities.status[cls] || ""}`}
    >
      {status}
    </span>
  );
}
function BookModal({ close, done, admin = false }) {
  const [form, setForm] = useState({
      title: "",
      author: "",
      description: "",
      category: "Fiction",
      deliveryFee: "2.99",
      quantity: "1",
      coverUrl: "",
    }),
    [file, setFile] = useState(null),
    [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      let coverUrl = form.coverUrl;
      if (file)
        coverUrl = await uploadImage(file, import.meta.env.VITE_IMGBB_API_KEY);
      if (!coverUrl)
        throw new Error("Add a cover image URL or choose an image file.");
      await api.post(admin ? "/admin/books" : "/books", {
        ...form,
        quantity: Number(form.quantity),
        deliveryFee: Number(form.deliveryFee),
        coverUrl,
      });
      toast.success(
        admin
          ? "Book added and published."
          : "Book submitted for admin approval.",
      );
      done();
    } catch (e) {
      toast.error(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div
      className="[position:fixed] [z-index:50] [inset:0] [background:rgb(41_37_91_/_56%)] [display:grid] [place-items:center] [padding:20px] [overflow:auto] [backdrop-filter:blur(8px)]"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className="[position:relative] [width:min(100%,_620px)] [max-height:calc(100vh_-_40px)] [overflow:auto] [background:#f8f8ff] [padding:35px] [border:1px_solid_rgb(255_255_255_/_75%)] [border-radius:28px] [box-shadow:0_28px_80px_rgb(28_26_69_/_25%)] max-[760px]:[padding:29px_20px]">
        <button
          className={`${"[position:absolute] [right:18px] [top:17px] [border:0] [background:transparent] [color:#5b4be8] [display:grid] [place-items:center] [padding:7px]"}`}
          onClick={close}
        >
          <X />
        </button>
        <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
          <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />{" "}
          ADD TO YOUR SHELVES
        </div>
        <h2 className="font-display text-[clamp(24px,2.5vw,34px)] font-extrabold leading-tight tracking-[-.04em] text-[#29294f]">Share a good read.</h2>
        <p className="text-[13px] leading-6 text-[#74758f]">
          {admin
            ? "This book will be added to the live catalog."
            : "New listings are reviewed by the BiblioDrop team before they go live."}
        </p>
        <form
          className="[display:flex] [flex-direction:column] [gap:16px] [margin-top:24px]"
          onSubmit={submit}
        >
          <label className="flex min-w-0 flex-col gap-2 text-[13px] font-bold text-[#484968]">
            Book title
            <input
              required
              minLength={1}
              name="title"
              className="h-11 w-full min-w-0 rounded-xl border border-[#deddf0] bg-white px-3.5 text-sm font-medium text-[#29294f] outline-none transition focus:border-[#7969f2] focus:ring-4 focus:ring-[#7969f2]/10"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-[13px] font-bold text-[#484968]">
            Author
            <input
              required
              name="author"
              className="h-11 w-full min-w-0 rounded-xl border border-[#deddf0] bg-white px-3.5 text-sm font-medium text-[#29294f] outline-none transition focus:border-[#7969f2] focus:ring-4 focus:ring-[#7969f2]/10"
              value={form.author}
              onChange={(e) =>
                setForm({
                  ...form,
                  author: e.target.value,
                })
              }
            />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex min-w-0 flex-col gap-2 text-[13px] font-bold text-[#484968]">
              Category
              <select
                value={form.category}
                className="h-11 w-full min-w-0 rounded-xl border border-[#deddf0] bg-white px-3.5 text-sm font-medium text-[#29294f] outline-none transition focus:border-[#7969f2] focus:ring-4 focus:ring-[#7969f2]/10"
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="flex min-w-0 flex-col gap-2 text-[13px] font-bold text-[#484968]">
              Delivery fee ($)
              <input
                type="number"
                min="0"
                step="0.01"
                required
                className="h-11 w-full min-w-0 rounded-xl border border-[#deddf0] bg-white px-3.5 text-sm font-medium text-[#29294f] outline-none transition focus:border-[#7969f2] focus:ring-4 focus:ring-[#7969f2]/10"
                value={form.deliveryFee}
                onChange={(e) =>
                  setForm({
                    ...form,
                    deliveryFee: e.target.value,
                  })
                }
              />
            </label>
          </div>
          <label className="flex min-w-0 flex-col gap-2 text-[13px] font-bold text-[#484968]">
            Available copies
            <input
              type="number"
              min="0"
              step="1"
              required
              className="h-11 w-full min-w-0 rounded-xl border border-[#deddf0] bg-white px-3.5 text-sm font-medium text-[#29294f] outline-none transition focus:border-[#7969f2] focus:ring-4 focus:ring-[#7969f2]/10"
              value={form.quantity}
              onChange={(e) =>
                setForm({
                  ...form,
                  quantity: e.target.value,
                })
              }
            />
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-[13px] font-bold text-[#484968]">
            Description
            <textarea
              required
              minLength={10}
              className="min-h-28 w-full min-w-0 resize-y rounded-xl border border-[#deddf0] bg-white px-3.5 py-3 text-sm font-medium text-[#29294f] outline-none transition focus:border-[#7969f2] focus:ring-4 focus:ring-[#7969f2]/10"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-[13px] font-bold text-[#484968]">
            Cover image URL
            <input
              type="url"
              className="h-11 w-full min-w-0 rounded-xl border border-[#deddf0] bg-white px-3.5 text-sm font-medium text-[#29294f] outline-none transition placeholder:text-[#a4a3ba] focus:border-[#7969f2] focus:ring-4 focus:ring-[#7969f2]/10"
              value={form.coverUrl}
              onChange={(e) =>
                setForm({
                  ...form,
                  coverUrl: e.target.value,
                })
              }
              placeholder="https://…"
            />
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-[13px] font-bold text-[#484968]">
            Or upload a cover
            <input
              type="file"
              accept="image/*"
              className="block w-full min-w-0 cursor-pointer rounded-xl border border-dashed border-[#c9c7e3] bg-white px-3 py-2.5 text-xs font-medium text-[#74758f] file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#f0edff] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#5b4be8] hover:border-[#7969f2]"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <button
            disabled={busy}
            className={`${"[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)] [width:100%] [margin-top:4px]"}`}
          >
            {busy ? <LoaderCircle className="animate-spin" size={17} /> : null}
            {admin ? "Add book" : "Submit for review"} <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
function EmptyState({ title, copy, action }) {
  return (
    <div className="[min-height:260px] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [text-align:center] [padding:35px] [color:#7f887d]">
      <span>
        <BookOpen size={24} />
      </span>
      <h3 className="font-display text-lg font-extrabold leading-snug tracking-[-.02em] text-[#29294f]">{title}</h3>
      <p className="text-[13px] leading-6 text-[#74758f]">{copy}</p>
      {action}
    </div>
  );
}
function NotFound() {
  return (
    <div className="[min-height:570px] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [text-align:center] [padding:65px_25px] max-[760px]:[min-height:520px]">
      <div className="[font-size:9px] [font-weight:700] [letter-spacing:1.7px] [color:#778176] [display:flex] [align-items:center] [gap:9px] [margin-bottom:17px]">
        <span className="[width:6px] [height:6px] [background:#ff718d] [border-radius:50%] [display:inline-block]" />{" "}
        THIS PAGE HAS TURNED
      </div>
      <h1 className="font-display text-[clamp(30px,3.4vw,44px)] font-black leading-tight tracking-[-.045em] text-[#222344]">
        Looks like this
        <br />
        <em>story is elsewhere.</em>
      </h1>
      <p className="text-[13px] leading-6 text-[#74758f]">
        We can’t find the page you’re looking for. Let’s get you back to the
        good books.
      </p>
      <Link
        className="[min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_19px] [border:1px_solid_transparent] [border-radius:999px] [font-size:12px] [font-weight:800] [letter-spacing:0.1px] [transition:transform_0.2s,_background_0.2s,_color_0.2s] [cursor:pointer] [margin-top:3px] [max-width:100%] [white-space:normal] [flex-wrap:wrap] [align-self:flex-start] [box-shadow:0_7px_17px_rgb(91_75_232_/_12%)] hover:[transform:translateY(-2px)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] disabled:[transform:none] [background:linear-gradient(135deg,_#7d6df6,_#5545de)] [color:white] [box-shadow:0_9px_20px_rgb(91_75_232_/_24%)] hover:[background:linear-gradient(135deg,_#6c5be9,_#4939cc)] hover:[filter:saturate(1.2)] hover:[transform:translateY(-1px)]"
        to="/"
      >
        Return home <ArrowRight size={17} />
      </Link>
    </div>
  );
}
function Footer({ dashboard = false }) {
  return (
    <footer className={`mt-14 rounded-t-[38px] bg-gradient-to-br from-[#29264f] to-[#39336f] px-[7.5%] pt-14 text-white max-[760px]:px-6 max-[760px]:pt-10 ${dashboard ? "ml-[255px] max-[760px]:ml-0" : ""}`}>
      <div className="mx-auto flex max-w-[1180px] justify-between gap-16 pb-12 max-[760px]:flex-col max-[760px]:gap-10 max-[760px]:pb-8">
        <div className="max-w-[440px]">
          <Link
            className="inline-flex items-center gap-3 font-display text-[23px] font-black leading-none tracking-[-.035em] text-white"
            to="/"
          >
            <span className="[width:42px] [height:42px] [display:grid] [place-items:center] [background:linear-gradient(145deg,_#8677ff,_#5b4be8)] [color:#faf7ef] [border-radius:15px_15px_15px_6px] [box-shadow:0_7px_16px_rgb(91_75_232_/_27%)] max-[760px]:[width:35px] max-[760px]:[height:35px] max-[390px]:[width:32px] max-[390px]:[height:32px]">
              <BookOpen size={21} />
            </span>
            <span>
              Biblio<span className="[color:#ff7c9b]">Drop</span>
              <small className="mt-1 block font-sans text-[9px] font-bold tracking-[.19em] text-[#c7c4e4]">BOOKS, BROUGHT CLOSER</small>
            </span>
          </Link>
          <p className="mt-4 max-w-[400px] text-sm leading-6 text-[#dedcf0]">
            A more personal way to find a story. Connecting readers and
            independent bookshelves, one delivery at a time.
          </p>
          <div className="mt-4 flex gap-2.5">
            <a className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm text-white transition hover:bg-[#7868f4]" href="https://x.com" aria-label="X">
              <X size={16} />
            </a>
            <a className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm text-white transition hover:bg-[#7868f4]" href="https://instagram.com" aria-label="Instagram">
              ◎
            </a>
            <a className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm font-bold text-white transition hover:bg-[#7868f4]" href="https://facebook.com" aria-label="Facebook">
              f
            </a>
          </div>
        </div>
        <div className="flex gap-24 pt-1 max-[1000px]:gap-14 max-[760px]:flex-wrap max-[760px]:gap-12">
          <div className="flex min-w-[150px] flex-col gap-3">
            <b className="mb-1 text-[11px] font-extrabold tracking-[.16em] text-[#ffb7c8]">EXPLORE</b>
            <Link className="text-sm text-[#efedf9] transition hover:text-white" to="/books">Browse books</Link>
            <a className="text-sm text-[#efedf9] transition hover:text-white" href="#how-it-works">How it works</a>
            <Link className="text-sm text-[#efedf9] transition hover:text-white" to="/register">List your books</Link>
          </div>
          <div className="flex min-w-[160px] flex-col gap-3">
            <b className="mb-1 text-[11px] font-extrabold tracking-[.16em] text-[#ffb7c8]">THE SMALL PRINT</b>
            <a className="text-sm text-[#efedf9] transition hover:text-white" href="mailto:hello@bibliodrop.example">Contact us</a>
            <a className="text-sm text-[#efedf9] transition hover:text-white" href="mailto:hello@bibliodrop.example?subject=Privacy">
              Privacy policy
            </a>
            <a className="text-sm text-[#efedf9] transition hover:text-white" href="mailto:hello@bibliodrop.example?subject=About">
              About BiblioDrop
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1180px] justify-between gap-4 border-t border-white/15 py-4 text-[10px] tracking-wide text-[#c7c4e4] max-[760px]:flex-col max-[760px]:gap-2">
        <span>
          © {new Date().getFullYear()} BiblioDrop. Made for the love of a good
          book.
        </span>
        <span>LOCAL SHELVES · WIDE OPEN STORIES</span>
      </div>
    </footer>
  );
}
export default App;
