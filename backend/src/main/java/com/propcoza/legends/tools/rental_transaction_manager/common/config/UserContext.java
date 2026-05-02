package com.propcoza.legends.tools.rental_transaction_manager.common.config;

public class UserContext {
    private static final ThreadLocal<String> currentUser = ThreadLocal.withInitial(() -> "SYSTEM");

    public static String getCurrentUser() {
        return currentUser.get();
    }

    public static void setCurrentUser(String user) {
        currentUser.set(user);
    }

    public static void clear() {
        currentUser.remove();
    }
}