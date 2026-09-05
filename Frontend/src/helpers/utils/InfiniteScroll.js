export class InfiniteScroll {
    constructor({
        container,
        sentinel,
        loadMore,
        renderItems,
        limit = 10
    }) {
        this.container = container;
        this.sentinel = sentinel;
        this.loadMore = loadMore;
        this.renderItems = renderItems;
        this.limit = limit;

        this.page = 1;
        this.loading = false;
        this.hasMore = true;

        this.observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
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
    }

    async loadNext() {
        if (this.loading || !this.hasMore) return;

        this.loading = true;

        try {
            const result = await this.loadMore({
                page: this.page,
                limit: this.limit
            });

            if (result && result.data && result.data.length > 0) {
                this.renderItems(result.data, this.container);
                
                // Update pagination status
                this.hasMore = result.pagination ? result.pagination.hasMore : false;
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
            this.loading = false;
        }
    }

    destroy() {
        this.observer.disconnect();
        if (this.sentinel && this.sentinel.parentNode) {
            this.sentinel.remove(); // Clean up sentinel when no more data exists
        }
    }
}