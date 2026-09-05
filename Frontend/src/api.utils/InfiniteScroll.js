export class InfiniteScroll {
    constructor({
        container,
        loadMore,
        renderItems,
        limit = 10,
        preloadAt = 7
    }) {
        this.container = container;
        this.loadMore = loadMore;
        this.renderItems = renderItems;

        this.limit = limit;
        this.preloadAt = preloadAt;

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

        this.loadNext();
    }

    async loadNext() {
        if (this.loading || !this.hasMore) return;

        this.loading = true;

        try {
            const result = await this.loadMore({
                page: this.page,
                limit: this.limit
            });

            this.renderItems(result.data);

            this.hasMore = result.pagination.hasMore;
            this.page++;

            if (!this.hasMore) {
                this.destroy();
            } else {
                this.updateSentinel();
            }
        } catch (error) {
            console.error("Failed to load more items:", error);
        } finally {
            this.loading = false;
        }
    }

    updateSentinel() {
        const items = this.container.children;

        if (items.length <= this.preloadAt) {
            this.observeLastItem();
            return;
        }

        const index = items.length - (this.limit - this.preloadAt);

        this.observe(items[index]);
    }

    observeLastItem() {
        const lastItem = this.container.lastElementChild;

        if (lastItem) {
            this.observe(lastItem);
        }
    }

    observe(element) {
        this.observer.disconnect();
        this.observer.observe(element);
    }

    destroy() {
        this.observer.disconnect();
    }
}