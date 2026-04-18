import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useDeferredValue,
  useTransition,
} from "react";
 import "./pagination.scss";

interface Product {
  id: number;
  title: string;
  images: string[];
}

interface ProductResponse {
  products: Product[];
  total: number;
}

const Productcard: React.FC<{ product: Product }> = ({ product }) => {
  const [iL, sIl] = useState<boolean>(false);

  return (
    <div className="product-card">
      <div className="product-image-container">
        {!iL && <div className="image-skeleton" data-testid="image-skeleton"></div>}

        <img
          src={product.images?.[0] || "https://via.placeholder.com/150"}
          alt={product.title}
          style={{ display: iL ? "block" : "none" }}
          onLoad={() => sIl(true)}
        />
      </div>

      <span>{product.title}</span>
    </div>
  );
};

export default function App() {
  const [cP, setCp] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  const pageSize = 10;

  /** FIX 1: Return value added */
  const skip = useMemo(() => cP * pageSize, [cP]);

  /** FIX 2: Total should update */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`
      );

      if (!res.ok) throw new Error("failed to load");

      const jsonData: ProductResponse = await res.json();
      setProducts(jsonData.products || []);
      setTotal(jsonData.total || 0); // <-- FIXED (missing earlier)
    } catch (error) {
      console.error("err", error);
    } finally {
      setLoading(false);
    }
  }, [skip]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /** FIX 3: return value added */
  const pages = useMemo(() => Math.ceil(total / pageSize), [total]);

  /** FIX 4: No iterator issue */
  const pageNumbers = useMemo(
    () => Array.from({ length: pages }, (_, i) => i),
    [pages]
  );

  const dP = useDeferredValue(products);

  const pP = () => {
    startTransition(() => {
      setCp((prev) => Math.max(prev - 1, 0));
    });
  };

  const nP = () => {
    startTransition(() => {
      setCp((prev) => Math.min(prev + 1, pages - 1));
    });
  };

  const gP = (index: number) => {
    startTransition(() => {
      setCp(index);
    });
  };

  return (
    <div className="App">
      <h1>Hello Pagination</h1>

      <div className="pagination">
        <button disabled={cP === 0} onClick={pP}>
          Prev
        </button>

        <button disabled={cP === pages - 1} onClick={nP}>
          Next
        </button>

        {pageNumbers.map((n) => (
          <button key={n} onClick={() => gP(n)}>
            {n + 1}
          </button>
        ))}
      </div>
   {(loading || isPending) && <p>Loading...</p>}


      {dP.map((p) => (
        <Productcard key={p.id} product={p} />
      ))}
    </div>
  );
}
