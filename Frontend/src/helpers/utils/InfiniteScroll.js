export class InfiniteScroll {
    constructor({
        container,
        sentinel,
        loadMore,
        renderItems,
        limit = 10,
        loaderHTML = ""
    }) {
        this.container = container;
        this.sentinel = sentinel;
        this.loadMore = loadMore;
        this.renderItems = renderItems;
        this.limit = limit;
        this.loaderHTML = loaderHTML;

        this.page = 1;
        this.loading = false;
        this.hasMore = true;

        this.observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    this.loadNext();
                }
            },
            {
                rootMargin: "200px"
            }
        );

        if (this.sentinel) {
            this.observer.observe(this.sentinel);
        }

        // Trigger immediate first page load
        this.loadNext();
    }

    showLoader() {
        if (!this.loaderHTML) return null;
        const wrapper = document.createElement("div");
        wrapper.innerHTML = this.loaderHTML;
        this.container.appendChild(wrapper);
        return wrapper;
    }

    async loadNext() {
        if (this.loading || !this.hasMore) return;

        this.loading = true;
        const loader = this.showLoader();

        try {
            const result = await this.loadMore({
                page: this.page,
                limit: this.limit
            });

            loader?.remove();

            const items = Array.isArray(result?.data) 
                ? result.data 
                : (Array.isArray(result) ? result : []);

            if (items.length > 0) {
                this.renderItems(items, this.container);
                
                // Update pagination status from backend hybrid loader
                this.hasMore = result?.pagination 
                    ? Boolean(result.pagination.hasMore) 
                    : (items.length >= this.limit);
                this.page++;
            } else {
                this.hasMore = false;
            }

            if (!this.hasMore) {
                this.destroy();
            }
        } catch (error) {
            console.error("Failed to load more items:", error);
        } finally {
            loader?.remove();
            this.loading = false;
        }
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.sentinel) {
            this.sentinel.style.display = "none";
        }
    }
}